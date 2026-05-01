import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api-basketball': {
          target: 'https://v1.basketball.api-sports.io',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-basketball/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('x-apisports-key', env.VITE_API_FOOTBALL_KEY || '')
              proxyReq.setHeader('Host', 'v1.basketball.api-sports.io') // ✅ correto
            })
          }
        },
        '/api': {
          target: 'https://v3.football.api-sports.io',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api(?!-basketball)/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('x-apisports-key', env.VITE_API_FOOTBALL_KEY || '')
              proxyReq.setHeader('Host', 'v3.football.api-sports.io')
            })
          }
        }
      }
    }
  }
})