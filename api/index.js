// Vercel Serverless Function Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('错误: 请配置 SUPABASE_URL 和 SUPABASE_ANON_KEY 环境变量');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 健康检查
app.get('/api', (req, res) => {
  res.json({ 
    success: true, 
    message: '待办管理 API 运行正常',
    timestamp: new Date().toISOString()
  });
});

// 获取所有待办事项
app.get('/api/todos', async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    
    let query = supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (category) query = query.eq('category', category);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('获取待办事项失败:', error);
    res.status(500).json({
      success: false,
      message: '获取待办事项失败',
      error: error.message
    });
  }
});

// 获取单个待办事项
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: '待办事项不存在'
        });
      }
      throw error;
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取待办事项失败',
      error: error.message
    });
  }
});

// 创建待办事项
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: '标题不能为空'
      });
    }

    const todoData = {
      title,
      description: description || null,
      status: status || 'pending',
      priority: priority || 'medium',
      category: category || null,
      due_date: dueDate || null
    };

    const { data, error } = await supabase
      .from('todos')
      .insert([todoData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: '待办事项创建成功',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建待办事项失败',
      error: error.message
    });
  }
});

// 更新待办事项
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;
    const id = req.params.id;

    const { data: existingTodo, error: checkError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: '待办事项不存在'
        });
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

    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: '待办事项更新成功',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新待办事项失败',
      error: error.message
    });
  }
});

// 删除待办事项
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const { data: existingTodo, error: checkError } = await supabase
      .from('todos')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: '待办事项不存在'
        });
      }
      throw checkError;
    }

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: '待办事项删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除待办事项失败',
      error: error.message
    });
  }
});

// 批量删除待办事项
app.post('/api/todos/batch-delete', async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要删除的待办事项ID列表'
      });
    }

    const { data, error } = await supabase
      .from('todos')
      .delete()
      .in('id', ids)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: `成功删除 ${data.length} 条待办事项`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '批量删除失败',
      error: error.message
    });
  }
});

// 获取统计信息
app.get('/api/todos/stats/summary', async (req, res) => {
  try {
    const { count: total, error: totalError } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    const { count: pending, error: pendingError } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    const { count: inProgress, error: inProgressError } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in-progress');

    if (inProgressError) throw inProgressError;

    const { count: completed, error: completedError } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (completedError) throw completedError;

    res.json({
      success: true,
      data: {
        total: total || 0,
        pending: pending || 0,
        inProgress: inProgress || 0,
        completed: completed || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取统计信息失败',
      error: error.message
    });
  }
});

// 导出为 Vercel Serverless Function
module.exports = app;
