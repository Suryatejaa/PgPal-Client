import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on mode in the current working directory
  const env = loadEnv(mode, process.cwd(), '')
  
  const isDev = mode.includes('development') || mode === 'development'
  const isProd = mode.includes('production') || mode === 'production'
  
  // Determine app type - always output to 'dist' for build script consistency
  let appType = env.VITE_APP_TYPE || 'base';
  let outDir = 'dist'; // Always use 'dist' so build script can rename it
  
  // Determine app type based on mode or env variable
  if (mode.includes('owner')) {
    appType = 'owner';
  } else if (mode.includes('tenant')) {
    appType = 'tenant';
  } else if (mode.includes('admin')) {
    appType = 'admin';
  } else if (mode === 'production') {
    appType = 'base';
  }
  
  // Override with explicit env variable if set
  if (env.VITE_APP_TYPE) {
    appType = env.VITE_APP_TYPE;
  }
  
  console.log(`🚀 Running in ${mode} mode`);
  console.log(`🔧 Environment: ${isDev ? 'Development' : 'Production'}`);
  console.log(`📡 API URL: ${env.VITE_API_URL}`);
  console.log(`🔌 WebSocket URL: ${env.VITE_WEBSOCKET_URL}`);
  console.log(`👤 App Type: ${appType}`);
  console.log(`📁 Output Directory: ${outDir}`);
  
  return {
    base: '/',
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __IS_DEV__: isDev,
      __IS_PROD__: isProd,
      __APP_TYPE__: JSON.stringify(appType), // Make app type available in runtime
    },
    server: {
      host: true,
      port: 5173,
      proxy: isDev ? {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/socket.io': {
          target: env.VITE_WEBSOCKET_URL || 'ws://localhost:4000',
          changeOrigin: true,
          ws: true,
        }
      } : undefined
    },
    build: {
      outDir,
      sourcemap: !isProd,
      minify: isProd ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: isProd ? {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@heroicons/react'],
          } : undefined
        }
      }
    },
    preview: {
      host: true,
      port: 4173
    }
  }
})