import { builtinModules } from 'node:module';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/vite-plugin-fastify.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: resolve(import.meta.dirname, 'src'),
      },
      external: [
        ...builtinModules,
        ...builtinModules.map((module) => `node:${module}`),
        ...Object.keys(packageJson.peerDependencies),
      ],
    },
  },
  plugins: [
    dts({
      exclude: ['**/__tests__/**', 'vite.config.ts'],
    }),
  ],
  test: {
    globals: true,
  },
});
