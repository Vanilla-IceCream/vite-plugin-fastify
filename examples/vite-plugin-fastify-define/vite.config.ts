import path from 'path';
import { defineConfig } from 'vite';
import fastify from 'vite-plugin-fastify';
import envify from 'process-envify';

export default defineConfig({
  define: envify({
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3000,
  }),
  plugins: [fastify()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
