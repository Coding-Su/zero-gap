// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // 1. 목표: 포텐스닷 API 서버 (끝에 슬래시 없어야 함)
        target: 'https://ai.potens.ai', 
        changeOrigin: true,
        secure: false,
        // 2. [핵심] 추적 장치: 터미널에 로그를 찍어서 확인합니다.
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ 프록시 에러:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📡 요청 보냄:', req.method, req.url, '=>', 'https://ai.potens.ai' + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📩 응답 받음:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})