import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173', // 실제 API 서버 주소에 맞게 수정하세요
        changeOrigin: true,
        /**
         * [해결] TS6133 에러 대응
         * 사용하지 않는 매개변수 앞에 _를 붙여 빌드 에러를 방지합니다.
         */
        configure: (proxy, _options) => { // options -> _options
          
          proxy.on('error', (err, _req, _res) => { // req, res -> _req, _res
            console.error('proxy error', err);
          });

          proxy.on('proxyReq', (_proxyReq, req, _res) => { // proxyReq, res -> _proxyReq, _res
            console.log('Sending Request to the Target:', req.method, req.url);
          });

          proxy.on('proxyRes', (proxyRes, _req, _res) => { // res -> _res
            console.log('Received Response from the Target:', proxyRes.statusCode);
          });
        },
      },
    },
  },
});