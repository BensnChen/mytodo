# Supabase 配置指南

本项目使用 Supabase 作为后端数据库。请按照以下步骤配置：

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 注册/登录账号
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - Name: `todo-management`（或其他名称）
   - Database Password: 设置一个强密码
   - Region: 选择离你最近的区域（如 Northeast Asia (Tokyo)）
5. 等待项目创建完成（约 2 分钟）

## 2. 获取项目凭证

项目创建完成后：

1. 进入项目控制台
2. 点击左侧菜单的 "Settings" → "API"
3. 找到以下信息：
   - **Project URL**: 类似 `https://xxxxx.supabase.co`
   - **anon public**: 公开的匿名密钥

## 3. 配置环境变量

1. 打开项目根目录的 `.env` 文件
2. 填入你的 Supabase 凭证：

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
PORT=3000
```

## 4. 创建数据库表

### 方法一：使用 SQL 编辑器（推荐）

1. 在 Supabase 控制台，点击左侧菜单的 "SQL Editor"
2. 点击 "New Query"
3. 复制 `supabase-setup.sql` 文件的全部内容
4. 粘贴到 SQL 编辑器中
5. 点击 "Run" 执行 SQL

### 方法二：使用表编辑器

1. 在 Supabase 控制台，点击左侧菜单的 "Table Editor"
2. 点击 "Create a new table"
3. 表名: `todos`
4. 添加以下列：

| 列名 | 类型 | 默认值 | 可空 | 说明 |
|------|------|--------|------|------|
| id | int8 | auto | 否 | 主键，自增 |
| title | text | - | 否 | 标题 |
| description | text | - | 是 | 描述 |
| status | text | 'pending' | 否 | 状态 |
| priority | text | 'medium' | 否 | 优先级 |
| category | text | - | 是 | 分类 |
| due_date | date | - | 是 | 截止日期 |
| created_at | timestamptz | now() | 否 | 创建时间 |
| updated_at | timestamptz | now() | 否 | 更新时间 |

5. 点击 "Save" 保存表结构

## 5. 配置行级安全策略 (RLS)

### 开发环境（允许所有操作）

1. 在 "Table Editor" 中选择 `todos` 表
2. 点击 "RLS" 标签
3. 启用 RLS
4. 添加策略：
   - Policy name: `Enable all operations`
   - Policy command: `ALL`
   - Target roles: `public`
   - USING expression: `true`
   - WITH CHECK expression: `true`

### 生产环境（推荐配置用户认证）

如果需要用户认证和权限控制，可以：

1. 添加 `user_id` 列到 `todos` 表
2. 配置策略只允许用户访问自己的数据：

```sql
-- 用户只能查看自己的待办事项
CREATE POLICY "Users can view own todos" ON todos
  FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能创建自己的待办事项
CREATE POLICY "Users can create own todos" ON todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的待办事项
CREATE POLICY "Users can update own todos" ON todos
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的待办事项
CREATE POLICY "Users can delete own todos" ON todos
  FOR DELETE
  USING (auth.uid() = user_id);
```

## 6. 安装依赖并启动

```bash
# 安装依赖
npm install

# 启动服务器
npm start

# 或使用开发模式（自动重启）
npm run dev
```

## 7. 验证连接

启动服务器后，你应该看到：

```
Supabase 客户端初始化成功
服务器运行在 http://localhost:3000
API 接口: http://localhost:3000/api/todos
Supabase URL: https://xxxxx.supabase.co
```

访问 `http://localhost:3000` 即可使用应用。

## 常见问题

### Q: 提示 "请在 .env 文件中配置 SUPABASE_URL 和 SUPABASE_ANON_KEY"

**A:** 确保：
1. `.env` 文件在项目根目录
2. 环境变量名称正确（不要有拼写错误）
3. 没有多余的空格或引号
4. 重启服务器以加载新的环境变量

### Q: API 返回 "new row violates row-level security policy"

**A:** 这是因为 RLS 策略配置不正确：
1. 确保已启用 RLS
2. 确保已添加允许操作的策略
3. 开发环境可以使用 `USING (true)` 允许所有操作

### Q: 数据库连接超时

**A:** 检查：
1. Supabase 项目是否正常运行
2. 网络连接是否正常
3. Project URL 是否正确

### Q: 想要查看数据库中的数据

**A:** 在 Supabase 控制台：
1. 点击 "Table Editor"
2. 选择 `todos` 表
3. 可以直接查看、编辑数据

## Supabase 优势

- ✅ **免费额度充足**: 500MB 数据库，50MB 文件存储
- ✅ **实时功能**: 支持实时数据订阅
- ✅ **自动 API**: 自动生成 RESTful API
- ✅ **用户认证**: 内置完整的认证系统
- ✅ **文件存储**: 支持文件上传和存储
- ✅ **PostgreSQL**: 功能强大的关系型数据库
- ✅ **全球 CDN**: 快速访问

## 下一步

- [ ] 添加用户认证功能
- [ ] 配置实时数据同步
- [ ] 添加文件上传功能
- [ ] 设置数据库备份
- [ ] 配置生产环境的安全策略
