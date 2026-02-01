# Vercel 部署完整指南

## 📦 项目结构说明

```
待办管理/
├── api/
│   └── index.js          # Vercel Serverless Function 入口
├── public/
│   ├── index.html        # 前端页面
│   └── config.js         # API 配置
├── server/
│   └── index.js          # 本地开发服务器
├── vercel.json           # Vercel 配置文件
└── package.json          # 依赖配置
```

## 🚀 部署步骤

### 1. 确认环境变量已配置

在 Vercel 项目中添加以下环境变量：

1. 访问 https://vercel.com/dashboard
2. 选择你的项目 `mytodo`
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量（**必须**）：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `SUPABASE_URL` | 你的 Supabase Project URL | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | 你的 Supabase anon key | Production, Preview, Development |

**如何获取 Supabase 凭证：**
- 登录 https://supabase.com/
- 进入你的项目
- Settings → API
- 复制 Project URL 和 anon public key

### 2. 触发重新部署

代码已经推送到 GitHub，Vercel 会自动检测并部署。

**手动触发部署：**
1. 访问 Vercel 项目页面
2. 点击 **Deployments** 标签
3. 等待自动部署完成（约 1-2 分钟）

或者手动触发：
1. 点击最新的部署
2. 点击 **⋯** 菜单
3. 选择 **Redeploy**

### 3. 验证部署

部署完成后，测试 API 是否正常：

```bash
# 测试健康检查
curl https://mytodo-m6n4.vercel.app/api

# 测试获取待办事项
curl https://mytodo-m6n4.vercel.app/api/todos

# 测试统计接口
curl https://mytodo-m6n4.vercel.app/api/todos/stats/summary
```

**预期响应：**
```json
{
  "success": true,
  "data": []
}
```

### 4. 访问前端

前端已部署到 GitHub Pages：
```
https://bensnchen.github.io/mytodo/
```

## 🔧 常见问题

### Q: API 返回 404

**原因：** Vercel 没有找到 serverless function

**解决：**
1. 确认 `api/index.js` 文件存在
2. 确认 `vercel.json` 配置正确
3. 重新部署

### Q: API 返回 500 错误

**原因：** 环境变量未配置或 Supabase 连接失败

**解决：**
1. 检查 Vercel 环境变量是否正确配置
2. 检查 Supabase 项目是否正常运行
3. 查看 Vercel 部署日志：
   - 进入 Deployments
   - 点击最新部署
   - 查看 **Function Logs**

### Q: 前端显示"加载待办事项失败"

**原因：** 前端无法连接到后端 API

**解决：**
1. 确认后端 API 正常工作（测试上面的 curl 命令）
2. 检查 `public/config.js` 中的 API 地址是否正确
3. 打开浏览器开发者工具（F12）查看网络请求错误

### Q: CORS 错误

**原因：** 跨域请求被阻止

**解决：**
- `api/index.js` 中已配置 `cors()`，应该不会有问题
- 如果仍有问题，检查浏览器控制台的具体错误信息

## 📊 API 端点列表

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api` | 健康检查 |
| GET | `/api/todos` | 获取所有待办事项 |
| GET | `/api/todos/:id` | 获取单个待办事项 |
| POST | `/api/todos` | 创建待办事项 |
| PUT | `/api/todos/:id` | 更新待办事项 |
| DELETE | `/api/todos/:id` | 删除待办事项 |
| POST | `/api/todos/batch-delete` | 批量删除 |
| GET | `/api/todos/stats/summary` | 获取统计信息 |

## 🔒 安全说明

- ✅ `.env` 文件不会上传到 GitHub
- ✅ 环境变量只存储在 Vercel 服务器
- ✅ Supabase 使用行级安全策略（RLS）
- ✅ 所有 API 请求通过 HTTPS

## 📝 本地开发

如果需要本地测试：

```bash
# 安装依赖
npm install

# 配置 .env 文件
# 填入你的 Supabase 凭证

# 启动本地服务器
npm start

# 访问
http://localhost:3000
```

## 🎯 完整部署流程总结

1. ✅ 代码已推送到 GitHub
2. ⏳ 在 Vercel 配置环境变量（**必须**）
3. ⏳ 等待 Vercel 自动部署
4. ✅ 测试 API 是否正常
5. ✅ 访问前端页面

**当前状态：**
- GitHub 仓库：https://github.com/BensnChen/mytodo ✅
- 前端地址：https://bensnchen.github.io/mytodo/ ✅
- 后端地址：https://mytodo-m6n4.vercel.app/api ⏳（等待配置环境变量）

## 🆘 需要帮助？

如果遇到问题：
1. 查看 Vercel 部署日志
2. 检查浏览器控制台错误
3. 测试 API 端点响应
4. 确认环境变量配置正确
