import path from 'path';
import fs from 'fs/promises';
import { test, expect } from 'vitest';
import { createServer, build, preview } from 'vite';
import { ofetch } from 'ofetch';

import fastify from './vite-plugin-fastify';

const appPath = path.resolve(__dirname, '../examples/vite-plugin-fastify/src/app.ts');
const serverPath = path.resolve(__dirname, '../examples/vite-plugin-fastify/src/server.ts');

test('vite-plugin-fastify', () => {
  const plugin = fastify({
    appPath,
    serverPath,
  });

  expect(plugin).toHaveProperty('name');
});

test('vite', async () => {
  const server = await createServer({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: path.resolve(__dirname, './dist'),
          format: 'cjs',
        },
      },
    },
    plugins: [
      fastify({
        appPath,
        serverPath,
      }),
    ],
  });

  await server.listen();

  const file = await fs.readFile(path.resolve(appPath, 'src/routes/hello.ts'));
  const data = file.toString().replace('Hello, Fastify!', 'Hello, vite-plugin-fastify!');
  await fs.writeFile(path.resolve(appPath, 'src/routes/hello.ts'), data);
  await ofetch('http://localhost:5173/hello');

  const file2 = await fs.readFile(path.resolve(appPath, 'src/routes/hello.ts'));
  const data2 = file2.toString().replace('Hello, vite-plugin-fastify!', 'Hello, Fastify!');
  await fs.writeFile(path.resolve(appPath, 'src/routes/hello.ts'), data2);
  await ofetch('http://localhost:5173/hello');

  await server.close();
});

test('vite build', async () => {
  await build({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: path.resolve(__dirname, './dist'),
          format: 'cjs',
        },
      },
    },
    plugins: [
      fastify({
        appPath,
        serverPath,
      }),
    ],
  });
});

test('vite preview', async () => {
  await build({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: path.resolve(__dirname, './dist'),
          format: 'cjs',
        },
      },
    },
    plugins: [
      fastify({
        appPath,
        serverPath,
      }),
    ],
  });

  const server = await preview();
  await ofetch('http://localhost:4173/hello');

  server.httpServer.close();
});
