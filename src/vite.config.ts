import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/potens': {
        target: 'https://potens.ai',
        changeOrigin: true,
        rewrite: (path) => {
          // /api/potens -> potens.ai의 실제 API 경로로 변환
          console.log('Original path:', path);
          const newPath = path.replace(/^\/api\/potens/, '/api/v1/chat'); // 실제 API 경로로 수정 필요
          console.log('Rewritten path:', newPath);
          return newPath;
        },
        secure: false, // 개발 중에는 false로 설정
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})
