// API 配置文件
// 部署到 GitHub Pages 时，请修改 PRODUCTION_API_URL 为你的后端 API 地址
const API_CONFIG = {
  DEVELOPMENT_API_URL: 'http://localhost:3000/api',
  PRODUCTION_API_URL: 'https://your-backend-api.vercel.app/api', // 修改为实际的后端 API 地址
};

// 自动检测环境
window.API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? API_CONFIG.DEVELOPMENT_API_URL
  : API_CONFIG.PRODUCTION_API_URL;
