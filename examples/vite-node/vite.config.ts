import path from 'path';
import { defineConfig } from 'vite';
import fastify from 'vite-plugin-fastify';

export default defineConfig({
  plugins: [
    fastify({
      appPath: './src/app.ts',
      serverPath: './src/server.ts',
      devMode: false,
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
