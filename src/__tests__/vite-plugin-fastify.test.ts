import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { ofetch } from 'ofetch';
import { build, createServer, preview } from 'vite';
import { expect, test } from 'vitest';

import fastify from '../vite-plugin-fastify.ts';

const srcPath = resolve(import.meta.dirname, '../../examples/vite-plugin-fastify-define/src');
const appPath = resolve(import.meta.dirname, srcPath, 'app.ts');
const serverPath = resolve(import.meta.dirname, srcPath, 'server.ts');

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
          dir: resolve(import.meta.dirname, './dist'),
          format: 'es',
        },
      },
    },
    plugins: [
      fastify({
        appPath,
        serverPath,
      }),
    ],
    resolve: {
      alias: {
        '~': srcPath,
      },
    },
  });

  await server.listen();

  const file = await fs.readFile(resolve(srcPath, 'routes/hello.ts'));
  const data = file.toString().replace('Hello, Fastify!', 'Hello, vite-plugin-fastify!');
  await fs.writeFile(resolve(srcPath, 'routes/hello.ts'), data);
  await ofetch('http://localhost:5173/api/hello');

  const file2 = await fs.readFile(resolve(srcPath, 'routes/hello.ts'));
  const data2 = file2.toString().replace('Hello, vite-plugin-fastify!', 'Hello, Fastify!');
  await fs.writeFile(resolve(srcPath, 'routes/hello.ts'), data2);
  await ofetch('http://localhost:5173/api/hello');

  await server.close();
});

test('vite build', async () => {
  await build({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: resolve(import.meta.dirname, './dist'),
          format: 'es',
        },
      },
    },
    plugins: [
      fastify({
        appPath,
        serverPath,
      }),
    ],
    resolve: {
      alias: {
        '~': srcPath,
      },
    },
  });
});

test('vite preview', async () => {
  await build({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: resolve(import.meta.dirname, './dist'),
          format: 'es',
        },
      },
    },
    plugins: [
      fastify({
        appPath,
        serverPath,
      }),
    ],
    resolve: {
      alias: {
        '~': srcPath,
      },
    },
  });

  const server = await preview();
  await setTimeout(3000);
  await ofetch('http://localhost:4173/api/hello');

  server.httpServer.close();
});
