import path from 'path';
import fs from 'fs/promises';
import { test, expect } from 'vitest';
import { createServer, build } from 'vite';
import fetch from 'node-fetch';

import fastify from './vite-plugin-fastify';

test('plugin', () => {
  const plugin = fastify({
    appPath: './src/app.ts',
    serverPath: './src/server.ts',
  });

  expect(plugin).toHaveProperty('name');
});

test('serve', async () => {
  const server = await createServer({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: path.resolve(__dirname, './fixtures/dist'),
          format: 'commonjs',
        },
      },
    },
    plugins: [
      fastify({
        appPath: path.resolve(__dirname, './fixtures/app.ts'),
        serverPath: path.resolve(__dirname, './fixtures/server.ts'),
      }),
    ],
  });

  await server.listen();

  const appFile = await fs.readFile(path.resolve(__dirname, './fixtures/app.ts'));
  const data = appFile.toString().replace('Hello, Fastify!', 'Hello, vite-plugin-fastify!');
  await fs.writeFile(path.resolve(__dirname, './fixtures/app.ts'), data);
  await fetch('http://localhost:5173/hello');

  const appFile2 = await fs.readFile(path.resolve(__dirname, './fixtures/app.ts'));
  const data2 = appFile2.toString().replace('Hello, vite-plugin-fastify!', 'Hello, Fastify!');
  await fs.writeFile(path.resolve(__dirname, './fixtures/app.ts'), data2);
  await fetch('http://localhost:5173/hello');

  await server.close();
});

test('build', async () => {
  await build({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: path.resolve(__dirname, './fixtures/dist'),
          format: 'commonjs',
        },
      },
    },
    plugins: [
      fastify({
        appPath: path.resolve(__dirname, './fixtures/app.ts'),
        serverPath: path.resolve(__dirname, './fixtures/server.ts'),
      }),
    ],
  });
});
