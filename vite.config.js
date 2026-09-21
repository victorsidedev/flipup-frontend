import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { resolveApiBaseUrl } from './src/config/api.js';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, import.meta.dirname, ['VITE_', 'API_']);
  if (command === 'build' && !env.VITE_API_BASE_URL?.trim()) {
    throw new Error(
      'Set VITE_API_BASE_URL for this build (for example, in Render Environment or .env.production.local).',
    );
  }
  const apiBaseUrl = resolveApiBaseUrl(env.VITE_API_BASE_URL);

  return {
    plugins: [react()],
    server: {
      proxy: apiBaseUrl.startsWith('/')
        ? {
            [apiBaseUrl]: {
              target: env.API_PROXY_TARGET || 'http://127.0.0.1:8000',
              changeOrigin: true,
              rewrite: (path) => path.slice(apiBaseUrl.length),
            },
          }
        : undefined,
    },
  };
});
