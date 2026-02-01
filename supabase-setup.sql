-- 创建待办事项表
CREATE TABLE IF NOT EXISTS todos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略 (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有操作（开发环境）
-- 生产环境中应该根据用户权限设置更严格的策略
CREATE POLICY "Enable all operations for all users" ON todos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 插入一些示例数据
INSERT INTO todos (title, description, status, priority, category, due_date) VALUES
  ('完成项目文档', '编写项目的技术文档和用户手册', 'pending', 'high', '工作', '2026-02-15'),
  ('学习 Vue 3', '深入学习 Vue 3 的 Composition API', 'in-progress', 'medium', '学习', '2026-02-20'),
  ('健身计划', '每周三次健身房锻炼', 'pending', 'medium', '健康', '2026-02-28'),
  ('购买生活用品', '采购日常生活必需品', 'pending', 'low', '生活', '2026-02-10'),
  ('代码审查', '审查团队成员提交的代码', 'completed', 'high', '工作', '2026-02-05');

COMMENT ON TABLE todos IS '待办事项表';
COMMENT ON COLUMN todos.id IS '主键ID';
COMMENT ON COLUMN todos.title IS '待办事项标题';
COMMENT ON COLUMN todos.description IS '待办事项描述';
COMMENT ON COLUMN todos.status IS '状态: pending(待处理), in-progress(进行中), completed(已完成)';
COMMENT ON COLUMN todos.priority IS '优先级: high(高), medium(中), low(低)';
COMMENT ON COLUMN todos.category IS '分类标签';
COMMENT ON COLUMN todos.due_date IS '截止日期';
COMMENT ON COLUMN todos.created_at IS '创建时间';
COMMENT ON COLUMN todos.updated_at IS '更新时间';
