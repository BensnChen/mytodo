# 待办管理系统

一个功能完整的全栈待办事项管理应用，包含前端和后端。

## 技术栈

### 后端
- **Node.js** - 运行环境
- **Express** - Web 框架
- **Supabase** - PostgreSQL 数据库 + 后端服务
- **CORS** - 跨域支持

### 前端
- **Vue 3** - 前端框架
- **Tailwind CSS** - 原子化 CSS 框架
- **Element Plus** - UI 组件库
- **原生 JavaScript** - 无需构建工具

### 部署
- **GitHub Pages** - 前端静态托管
- **Vercel/Railway** - 后端 API 托管

## 功能特性

### 核心功能
- ✅ 待办事项的增删改查（CRUD）
- ✅ 状态管理（待处理、进行中、已完成）
- ✅ 优先级设置（高、中、低）
- ✅ 分类管理
- ✅ 截止日期设置
- ✅ 搜索和筛选
- ✅ 批量删除
- ✅ 统计仪表盘

### 界面特点
- 📊 仪表盘展示统计数据
- 🎨 现代化的 UI 设计
- 📱 响应式布局
- 🔍 强大的搜索和筛选功能
- 📝 直观的表单操作

## 安装和运行

### 1. 配置 Supabase

请先按照 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 文档配置 Supabase 数据库。

简要步骤：
1. 在 [Supabase](https://supabase.com/) 创建项目
2. 执行 `supabase-setup.sql` 创建数据表
3. 复制 Project URL 和 anon key 到 `.env` 文件

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

编辑 `.env` 文件，填入你的 Supabase 凭证：

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
PORT=3000
```

### 4. 启动后端服务器

```bash
npm start
```

或使用开发模式（自动重启）：

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

### 5. 访问应用

在浏览器中打开：

```
http://localhost:3000
```

## API 接口文档

### 基础 URL
```
http://localhost:3000/api
```

### 接口列表

#### 1. 获取所有待办事项
```
GET /todos
```

查询参数：
- `status` - 状态筛选（pending/in-progress/completed）
- `priority` - 优先级筛选（high/medium/low）
- `category` - 分类筛选
- `search` - 搜索关键词

#### 2. 获取单个待办事项
```
GET /todos/:id
```

#### 3. 创建待办事项
```
POST /todos
```

请求体：
```json
{
  "title": "待办标题",
  "description": "待办描述",
  "status": "pending",
  "priority": "medium",
  "category": "工作",
  "dueDate": "2026-02-15"
}
```

#### 4. 更新待办事项
```
PUT /todos/:id
```

请求体：同创建接口

#### 5. 删除待办事项
```
DELETE /todos/:id
```

#### 6. 批量删除待办事项
```
POST /todos/batch-delete
```

请求体：
```json
{
  "ids": [1, 2, 3]
}
```

#### 7. 获取统计信息
```
GET /todos/stats/summary
```

返回：
```json
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 3,
    "inProgress": 4,
    "completed": 3
  }
}
```

## 数据库结构

### todos 表（Supabase PostgreSQL）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键，自增 |
| title | TEXT | 标题（必填） |
| description | TEXT | 描述 |
| status | TEXT | 状态（pending/in-progress/completed） |
| priority | TEXT | 优先级（high/medium/low） |
| category | TEXT | 分类 |
| due_date | DATE | 截止日期 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

## 项目结构

```
待办管理/
├── server/
│   └── index.js              # 后端服务器主文件
├── public/
│   └── index.html            # 前端页面
├── .env                      # 环境变量配置（需手动配置）
├── .env.example              # 环境变量示例
├── supabase-setup.sql        # Supabase 数据库初始化脚本
├── SUPABASE_SETUP.md         # Supabase 配置指南
├── package.json              # 项目配置
└── README.md                 # 项目文档
```

## 开发说明

### 后端开发
- 后端代码位于 `server/index.js`
- 使用 Supabase 作为数据库（PostgreSQL）
- 所有 API 接口都有错误处理和数据验证
- 环境变量通过 `.env` 文件配置

### 前端开发
- 前端是单页面应用，位于 `public/index.html`
- 使用 CDN 引入 Vue 3 和 Element Plus，无需构建步骤
- 采用 Composition API 编写
- 响应式设计，支持移动端

## 注意事项

1. **必须先配置 Supabase**：参考 `SUPABASE_SETUP.md` 文档
2. **环境变量**：`.env` 文件不会提交到 Git，需要手动配置
3. **数据库初始化**：在 Supabase 控制台执行 `supabase-setup.sql`
4. **CORS 配置**：前端通过 CORS 访问后端 API
5. **端口配置**：默认端口为 3000，可在 `.env` 中修改

## 后续扩展建议

- [ ] 添加用户认证和授权（Supabase Auth）
- [ ] 实时数据同步（Supabase Realtime）
- [ ] 支持待办事项标签
- [ ] 添加提醒功能
- [ ] 支持附件上传（Supabase Storage）
- [ ] 添加评论功能
- [ ] 导出数据功能
- [ ] 移动端 App
- [ ] 多语言支持

## Supabase 优势

- ✅ **免费额度充足**: 500MB 数据库，50MB 文件存储，每月 2GB 带宽
- ✅ **PostgreSQL**: 功能强大的关系型数据库
- ✅ **实时功能**: 支持实时数据订阅
- ✅ **用户认证**: 内置完整的认证系统
- ✅ **文件存储**: 支持文件上传和存储
- ✅ **自动 API**: 自动生成 RESTful API
- ✅ **全球 CDN**: 快速访问

## 🚀 部署到 GitHub

详细的部署步骤请查看：
- [GITHUB_SETUP.md](./GITHUB_SETUP.md) - GitHub 快速部署指南
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署文档

### 快速部署

```bash
# 1. 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 2. 推送到 GitHub（替换为你的仓库地址）
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main

# 3. 在 GitHub 仓库设置中启用 GitHub Pages (Source: GitHub Actions)

# 4. 部署后端到 Vercel
npm install -g vercel
vercel login
vercel
```

## 📁 项目文件说明

- `public/index.html` - 前端主页面（使用 Tailwind CSS）
- `public/config.js` - API 配置文件
- `server/index.js` - 后端服务器
- `supabase-setup.sql` - 数据库初始化脚本
- `.github/workflows/deploy.yml` - GitHub Actions 自动部署配置
- `vercel.json` - Vercel 部署配置
- `GITHUB_SETUP.md` - GitHub 快速部署指南
- `DEPLOYMENT.md` - 详细部署指南
- `SUPABASE_SETUP.md` - Supabase 配置指南

## 许可证

MIT License
