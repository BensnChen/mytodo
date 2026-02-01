// Vercel Serverless Function
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// 解析请求体
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// 主处理函数
module.exports = async (req, res) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // 设置 CORS 头
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const url = req.url || '';
  const method = req.method || 'GET';

  // 检查环境变量
  if (!supabaseUrl || !supabaseKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({
      success: false,
      message: '服务器配置错误：缺少 Supabase 环境变量'
    }));
    return;
  }

  try {
    // 健康检查 - /api
    if (url === '/api' || url === '/api/') {
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: '待办管理 API 运行正常',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // 统计信息 - /api/todos/stats/summary
    if (url.includes('/api/todos/stats/summary') && method === 'GET') {
      const { count: total } = await supabase.from('todos').select('*', { count: 'exact', head: true });
      const { count: pending } = await supabase.from('todos').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const { count: inProgress } = await supabase.from('todos').select('*', { count: 'exact', head: true }).eq('status', 'in-progress');
      const { count: completed } = await supabase.from('todos').select('*', { count: 'exact', head: true }).eq('status', 'completed');

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        data: { total: total || 0, pending: pending || 0, inProgress: inProgress || 0, completed: completed || 0 }
      }));
      return;
    }

    // 批量删除 - /api/todos/batch-delete
    if (url.includes('/api/todos/batch-delete') && method === 'POST') {
      const body = await parseBody(req);
      const { ids } = body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, message: '请提供要删除的待办事项ID列表' }));
        return;
      }

      const { data, error } = await supabase.from('todos').delete().in('id', ids).select();
      if (error) throw error;

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, message: `成功删除 ${data.length} 条待办事项` }));
      return;
    }

    // 获取所有待办 - GET /api/todos
    if ((url === '/api/todos' || url === '/api/todos/' || url.startsWith('/api/todos?')) && method === 'GET') {
      const urlObj = new URL(url, `http://${req.headers.host}`);
      const status = urlObj.searchParams.get('status');
      const priority = urlObj.searchParams.get('priority');
      const category = urlObj.searchParams.get('category');
      const search = urlObj.searchParams.get('search');

      let query = supabase.from('todos').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      if (priority) query = query.eq('priority', priority);
      if (category) query = query.eq('category', category);
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

      const { data, error } = await query;
      if (error) throw error;

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, data: data || [] }));
      return;
    }

    // 创建待办 - POST /api/todos
    if ((url === '/api/todos' || url === '/api/todos/') && method === 'POST') {
      const body = await parseBody(req);
      const { title, description, status, priority, category, dueDate } = body;

      if (!title) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, message: '标题不能为空' }));
        return;
      }

      const todoData = {
        title,
        description: description || null,
        status: status || 'pending',
        priority: priority || 'medium',
        category: category || null,
        due_date: dueDate || null
      };

      const { data, error } = await supabase.from('todos').insert([todoData]).select().single();
      if (error) throw error;

      res.statusCode = 201;
      res.end(JSON.stringify({ success: true, message: '待办事项创建成功', data }));
      return;
    }

    // 单个待办操作 - /api/todos/:id
    const todoIdMatch = url.match(/\/api\/todos\/(\d+)/);
    if (todoIdMatch) {
      const id = todoIdMatch[1];

      // 获取单个待办 - GET
      if (method === 'GET') {
        const { data, error } = await supabase.from('todos').select('*').eq('id', id).single();
        if (error) {
          if (error.code === 'PGRST116') {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, message: '待办事项不存在' }));
            return;
          }
          throw error;
        }
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, data }));
        return;
      }

      // 更新待办 - PUT
      if (method === 'PUT') {
        const body = await parseBody(req);
        const { title, description, status, priority, category, dueDate } = body;

        const { data: existingTodo, error: checkError } = await supabase.from('todos').select('*').eq('id', id).single();
        if (checkError) {
          if (checkError.code === 'PGRST116') {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, message: '待办事项不存在' }));
            return;
          }
          throw checkError;
        }

        const updateData = {
          title: title || existingTodo.title,
          description: description !== undefined ? description : existingTodo.description,
          status: status || existingTodo.status,
          priority: priority || existingTodo.priority,
          category: category !== undefined ? category : existingTodo.category,
          due_date: dueDate !== undefined ? dueDate : existingTodo.due_date,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase.from('todos').update(updateData).eq('id', id).select().single();
        if (error) throw error;

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, message: '待办事项更新成功', data }));
        return;
      }

      // 删除待办 - DELETE
      if (method === 'DELETE') {
        const { error: checkError } = await supabase.from('todos').select('id').eq('id', id).single();
        if (checkError) {
          if (checkError.code === 'PGRST116') {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, message: '待办事项不存在' }));
            return;
          }
          throw checkError;
        }

        const { error } = await supabase.from('todos').delete().eq('id', id);
        if (error) throw error;

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, message: '待办事项删除成功' }));
        return;
      }
    }

    // 未匹配的路由
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: '接口不存在' }));

  } catch (error) {
    console.error('API Error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({
      success: false,
      message: '服务器内部错误',
      error: error.message
    }));
  }
};
