import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load .env file based on the current mode
  const env = loadEnv(mode, process.cwd(), '')

  // --- Simplified and Corrected Logic ---

  // The single source of truth for the app type is the VITE_APP_TYPE
  // environment variable, which is reliably set by `cross-env` in package.json.
  const appType = env.VITE_APP_TYPE || 'base';

  // The proxy target should be the BASE URL of your backend.
  // The '/api' path from your frontend requests will be automatically appended.
  const proxyApiTarget = env.VITE_API_URL;
  const proxyWsTarget = env.VITE_WEBSOCKET_URL;

  const isDev = mode.includes('development');

  console.log(`🚀 Running Vite in mode: ${mode}`);
  console.log(`👤 App Type: ${appType}`);
  console.log(`📡 API Proxy Target: ${proxyApiTarget}`);
  console.log(`🔌 WebSocket Proxy Target: ${proxyWsTarget}`);

  return {
    base: '/',
    plugins: [react()],
    define: {
      // Make the app type available in your runtime code
      'import.meta.env.VITE_APP_TYPE': JSON.stringify(appType),
    },
    server: {
      host: true,
      port: 5173,
      // The proxy is only needed for local development to avoid CORS issues.
      proxy: isDev && proxyApiTarget ? {
        // Requests to /api/... will be sent to your backend server
        '/api': {
          target: proxyApiTarget,
          changeOrigin: true,
          secure: false,
          // We REMOVE the rewrite rule. The backend gateway expects paths like /api/auth-service/...
        },
        // Proxy WebSocket connections
        '/socket.io': {
          target: proxyWsTarget,
          changeOrigin: true,
          ws: true,
        }
      } : undefined
    },
    build: {
      // The outDir is set by the npm script (e.g., --outDir dist-tenant)
      // This is just a fallback.
      outDir: `dist-${appType}`,
      sourcemap: !mode.includes('production'),
      minify: mode.includes('production') ? 'esbuild' : false,
    },
    preview: {
      host: true,
      port: 4173
    }
  }
})