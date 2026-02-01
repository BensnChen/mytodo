const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 初始化数据库
const db = new sqlite3.Database('./todos.db', (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功');
    initDatabase();
  }
});

// 创建表
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      dueDate TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('创建表失败:', err.message);
    } else {
      console.log('数据表初始化成功');
    }
  });
}

// API 路由

// 获取所有待办事项
app.get('/api/todos', (req, res) => {
  const { status, priority, search } = req.query;
  let query = 'SELECT * FROM todos WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (priority && priority !== 'all') {
    query += ' AND priority = ?';
    params.push(priority);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY createdAt DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ data: rows, total: rows.length });
    }
  });
});

// 获取单个待办事项
app.get('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: '待办事项不存在' });
    } else {
      res.json({ data: row });
    }
  });
});

// 创建待办事项
app.post('/api/todos', (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: '标题不能为空' });
  }

  const query = `
    INSERT INTO todos (title, description, priority, status, dueDate)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [title, description || '', priority || 'medium', status || 'pending', dueDate || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          message: '创建成功',
          data: { id: this.lastID }
        });
      }
    }
  );
});

// 更新待办事项
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: '标题不能为空' });
  }

  const query = `
    UPDATE todos 
    SET title = ?, description = ?, priority = ?, status = ?, dueDate = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(
    query,
    [title, description, priority, status, dueDate, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: '待办事项不存在' });
      } else {
        res.json({ message: '更新成功' });
      }
    }
  );
});

// 删除待办事项
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '待办事项不存在' });
    } else {
      res.json({ message: '删除成功' });
    }
  });
});

// 批量删除待办事项
app.post('/api/todos/batch-delete', (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: '请选择要删除的项目' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const query = `DELETE FROM todos WHERE id IN (${placeholders})`;

  db.run(query, ids, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: `成功删除 ${this.changes} 条记录` });
    }
  });
});

// 统计数据
app.get('/api/todos/stats/summary', (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority
    FROM todos
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ data: row });
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('数据库连接已关闭');
    process.exit(0);
  });
});
