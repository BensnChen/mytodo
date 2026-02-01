# 部署指南

本项目支持前后端分离部署：
- **前端**: 部署到 GitHub Pages（免费静态托管）
- **后端**: 部署到 Vercel、Railway 或其他 Node.js 托管平台

## 📦 前端部署到 GitHub Pages

### 步骤 1: 创建 GitHub 仓库

1. 在 GitHub 上创建一个新仓库（例如：`todo-management`）
2. 不要初始化 README、.gitignore 或 license

### 步骤 2: 初始化本地 Git 仓库

```bash
cd /Users/bensn/Desktop/待办管理

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit: 待办管理系统"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/todo-management.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 3: 配置 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 **Settings** → **Pages**
3. 在 **Source** 下选择 **GitHub Actions**
4. 推送代码后会自动触发部署

### 步骤 4: 访问前端应用

部署完成后，访问：
```
https://your-username.github.io/todo-management/
```

## 🚀 后端部署到 Vercel（推荐）

### 方法一：通过 Vercel CLI

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel
```

4. **配置环境变量**
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

5. **生产环境部署**
```bash
vercel --prod
```

### 方法二：通过 Vercel 网站

1. 访问 [Vercel](https://vercel.com/)
2. 点击 **Import Project**
3. 选择你的 GitHub 仓库
4. 配置环境变量：
   - `SUPABASE_URL`: 你的 Supabase 项目 URL
   - `SUPABASE_ANON_KEY`: 你的 Supabase anon key
5. 点击 **Deploy**

部署完成后，你会得到一个后端 API 地址，例如：
```
https://todo-management.vercel.app
```

### 步骤 5: 更新前端 API 配置

编辑 `public/config.js`，将 `PRODUCTION_API_URL` 修改为你的后端 API 地址：

```javascript
const API_CONFIG = {
  DEVELOPMENT_API_URL: 'http://localhost:3000/api',
  PRODUCTION_API_URL: 'https://todo-management.vercel.app/api', // 修改为实际地址
};
```

然后重新提交并推送：

```bash
git add public/config.js
git commit -m "Update production API URL"
git push
```

## 🚂 后端部署到 Railway（备选方案）

### 步骤 1: 创建 Railway 项目

1. 访问 [Railway](https://railway.app/)
2. 使用 GitHub 登录
3. 点击 **New Project** → **Deploy from GitHub repo**
4. 选择你的仓库

### 步骤 2: 配置环境变量

在 Railway 项目设置中添加：
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `PORT` (Railway 会自动设置)

### 步骤 3: 配置启动命令

在 Railway 设置中：
- **Start Command**: `node server/index.js`
- **Root Directory**: `/`

### 步骤 4: 部署

Railway 会自动部署，完成后你会得到一个 API 地址。

## 🔧 其他部署选项

### Render.com

1. 访问 [Render](https://render.com/)
2. 创建 **New Web Service**
3. 连接 GitHub 仓库
4. 配置：
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - 添加环境变量

### Heroku

1. 安装 Heroku CLI
2. 创建 `Procfile`:
```
web: node server/index.js
```

3. 部署：
```bash
heroku create
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
git push heroku main
```

## 📝 部署检查清单

### 前端部署前
- [ ] 确认 `public/config.js` 中的 API 地址正确
- [ ] 测试本地前端是否正常工作
- [ ] 确认 GitHub Actions 工作流文件存在

### 后端部署前
- [ ] 确认 `.env` 文件配置正确（本地测试用）
- [ ] 在部署平台配置环境变量
- [ ] 确认 Supabase 数据库已初始化
- [ ] 测试本地后端 API 是否正常

### 部署后
- [ ] 访问前端 URL，确认页面加载正常
- [ ] 测试 API 连接是否成功
- [ ] 测试增删改查功能
- [ ] 检查浏览器控制台是否有错误
- [ ] 测试移动端响应式布局

## 🐛 常见问题

### Q: GitHub Pages 显示 404

**A:** 检查：
1. GitHub Pages 设置是否正确（Settings → Pages）
2. 是否选择了 GitHub Actions 作为 Source
3. Actions 是否成功运行（查看 Actions 标签页）

### Q: 前端无法连接后端 API

**A:** 检查：
1. `public/config.js` 中的 API 地址是否正确
2. 后端是否成功部署
3. 浏览器控制台的网络请求错误信息
4. 后端 CORS 配置是否正确

### Q: Vercel 部署失败

**A:** 检查：
1. `vercel.json` 配置是否正确
2. 环境变量是否已设置
3. 查看 Vercel 部署日志
4. 确认 `package.json` 中的依赖是否完整

### Q: 后端 API 返回 500 错误

**A:** 检查：
1. Supabase 环境变量是否正确配置
2. Supabase 数据库表是否已创建
3. 查看后端日志（Vercel/Railway 控制台）
4. 测试 Supabase 连接是否正常

## 🔒 安全建议

1. **不要提交敏感信息**
   - `.env` 文件已在 `.gitignore` 中
   - 不要在代码中硬编码密钥

2. **配置 Supabase RLS**
   - 生产环境应启用行级安全策略
   - 限制匿名用户的操作权限

3. **使用 HTTPS**
   - GitHub Pages 和 Vercel 默认支持 HTTPS
   - 确保 API 请求使用 HTTPS

4. **环境变量管理**
   - 在部署平台的设置中配置环境变量
   - 不要在前端代码中暴露敏感密钥

## 📊 性能优化

1. **前端优化**
   - Tailwind CSS 使用 CDN（生产环境可考虑构建优化）
   - 图片使用 CDN
   - 启用浏览器缓存

2. **后端优化**
   - 使用 Supabase 连接池
   - 添加 API 缓存
   - 启用 gzip 压缩

3. **数据库优化**
   - 在 Supabase 中创建必要的索引
   - 优化查询语句
   - 定期清理过期数据

## 🎉 部署成功

部署完成后，你将拥有：
- 前端：`https://your-username.github.io/todo-management/`
- 后端：`https://your-backend.vercel.app/api`

享受你的待办管理系统吧！🚀
