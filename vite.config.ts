import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/vite-plugin-fastify.ts'),
      formats: ['es', 'cjs'],
    },
  },
  plugins: [dts()],
  test: {
    testTimeout: 10_000,
  },
});
