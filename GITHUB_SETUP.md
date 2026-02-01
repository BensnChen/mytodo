# GitHub 部署快速指南

## 🚀 5 分钟部署到 GitHub

### 步骤 1: 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com/)
2. 点击右上角的 **+** → **New repository**
3. 填写仓库信息：
   - Repository name: `todo-management`（或其他名称）
   - Description: `待办管理系统 - 全栈应用`
   - 选择 **Public**（GitHub Pages 免费版需要公开仓库）
   - **不要**勾选 "Initialize this repository with"
4. 点击 **Create repository**

### 步骤 2: 推送代码到 GitHub

在项目目录打开终端，执行以下命令：

```bash
# 进入项目目录
cd /Users/bensn/Desktop/待办管理

# 初始化 Git 仓库（如果还没有初始化）
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit: 待办管理系统"

# 添加远程仓库（替换 YOUR-USERNAME 和 YOUR-REPO 为实际值）
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**示例**（替换为你的实际用户名和仓库名）：
```bash
git remote add origin https://github.com/bensn/todo-management.git
git branch -M main
git push -u origin main
```

### 步骤 3: 配置 GitHub Pages

1. 在 GitHub 仓库页面，点击 **Settings**
2. 在左侧菜单找到 **Pages**
3. 在 **Source** 部分：
   - 选择 **GitHub Actions**
4. 保存设置

### 步骤 4: 等待部署完成

1. 点击仓库顶部的 **Actions** 标签
2. 你会看到一个正在运行的工作流 "Deploy to GitHub Pages"
3. 等待工作流完成（通常 1-2 分钟）
4. 完成后会显示绿色的 ✓ 标记

### 步骤 5: 访问你的网站

部署完成后，你的前端应用将在以下地址可用：

```
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

例如：
```
https://bensn.github.io/todo-management/
```

## 🔧 配置后端 API

前端部署完成后，你需要部署后端并配置 API 地址。

### 选项 1: 部署到 Vercel（推荐）

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署后端**
```bash
vercel
```

按照提示操作：
- Set up and deploy: `Y`
- Which scope: 选择你的账户
- Link to existing project: `N`
- Project name: `todo-management-api`（或其他名称）
- In which directory is your code located: `./`
- Override settings: `N`

4. **配置环境变量**
```bash
vercel env add SUPABASE_URL production
# 粘贴你的 Supabase URL

vercel env add SUPABASE_ANON_KEY production
# 粘贴你的 Supabase anon key
```

5. **生产环境部署**
```bash
vercel --prod
```

6. **获取 API 地址**
部署完成后，你会得到一个地址，例如：
```
https://todo-management-api.vercel.app
```

### 选项 2: 使用 Vercel 网站部署

1. 访问 [vercel.com](https://vercel.com/)
2. 点击 **Import Project**
3. 选择你的 GitHub 仓库
4. 在 **Environment Variables** 中添加：
   - `SUPABASE_URL`: 你的 Supabase 项目 URL
   - `SUPABASE_ANON_KEY`: 你的 Supabase anon key
5. 点击 **Deploy**

### 步骤 6: 更新前端 API 配置

1. 编辑 `public/config.js` 文件：

```javascript
const API_CONFIG = {
  DEVELOPMENT_API_URL: 'http://localhost:3000/api',
  PRODUCTION_API_URL: 'https://todo-management-api.vercel.app/api', // 改为你的实际地址
};
```

2. 提交并推送更改：

```bash
git add public/config.js
git commit -m "Update production API URL"
git push
```

3. GitHub Actions 会自动重新部署前端

## ✅ 验证部署

访问你的 GitHub Pages 地址，检查：

1. **页面是否正常加载**
   - 侧边栏、导航栏显示正常
   - Tailwind CSS 样式生效

2. **API 连接是否正常**
   - 打开浏览器开发者工具（F12）
   - 查看 Console 是否有错误
   - 查看 Network 标签，检查 API 请求

3. **功能是否正常**
   - 仪表盘数据显示
   - 待办事项列表加载
   - 新增、编辑、删除功能

## 🐛 常见问题

### Q: 推送代码时提示权限错误

**A:** 使用 Personal Access Token：
1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 生成新 token，勾选 `repo` 权限
3. 使用 token 作为密码推送代码

### Q: GitHub Actions 失败

**A:** 检查：
1. 仓库是否为 Public（免费版需要）
2. GitHub Pages 是否启用
3. 查看 Actions 日志中的错误信息

### Q: 页面显示但样式错误

**A:** 检查：
1. Tailwind CSS CDN 是否加载成功
2. 浏览器控制台是否有 CSS 加载错误
3. 清除浏览器缓存后重试

### Q: API 请求失败

**A:** 检查：
1. `public/config.js` 中的 API 地址是否正确
2. 后端是否成功部署
3. Supabase 环境变量是否正确配置
4. 浏览器控制台的网络请求详情

## 📝 后续更新

每次修改代码后，只需：

```bash
git add .
git commit -m "描述你的更改"
git push
```

GitHub Actions 会自动重新部署前端。

## 🎉 完成！

恭喜！你的待办管理系统已经成功部署到 GitHub Pages！

- 前端地址：`https://YOUR-USERNAME.github.io/YOUR-REPO/`
- 后端地址：`https://YOUR-API.vercel.app/api`

现在你可以在任何地方访问你的待办管理系统了！🚀
