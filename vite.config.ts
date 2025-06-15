import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on mode in the current working directory
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log(`🚀 Running in ${mode} mode`);
  console.log(`📡 API URL: ${env.VITE_API_URL}`);
  console.log(`🔌 WebSocket URL: ${env.VITE_WEBSOCKET_URL}`);
  console.log(`👤 App Type: ${env.VITE_APP_TYPE}`);
  
  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    server: {
      host: true,
      port: 5173,
      proxy: mode === 'development' ? {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      } : {}
    },
    build: {
      outDir: `dist-${mode}`,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@heroicons/react'],
          }
        }
      }
    },
    preview: {
      host: true,
      port: 4173
    }
  }
})