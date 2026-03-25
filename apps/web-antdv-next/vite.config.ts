import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@vben/vite-config';

import { loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const appDir = path.resolve(__dirname);
  const env = loadEnv('development', appDir, '');

  const target =
    env.VITE_NITRO_MOCK === 'true'
      ? 'http://localhost:5320/api'
      : 'http://localhost:8080/rock-blade/admin';

  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (p) => p.replace(/^\/api/, ''),
            target,
            ws: true,
          },
        },
      },
    },
  };
});
