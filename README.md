# vite-plugin-fastify

Fastify plugin for Vite.

## Installation

Install `vite-plugin-fastify` with your favorite package manager:

```sh
$ npm i vite-plugin-fastify -D
# or
$ yarn add vite-plugin-fastify -D
# or
$ pnpm i vite-plugin-fastify -D
# or
$ bun add vite-plugin-fastify -D
```

## Usage

```json5
// package.json
{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "node dist/server.mjs"
  }
  // ...
}
```

```ts
// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import fastify from 'vite-plugin-fastify';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    fastify({
      appPath: './src/app.ts',
      serverPath: './src/server.ts',
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
```

```ts
// src/app.ts
import type { FastifyServerOptions } from 'fastify';
import fastify from 'fastify';

const app = async (options: FastifyServerOptions = {}) => {
  const app = fastify(options);

  app.get('/api/hello-world', async (req, reply) => {
    return reply.send('Hello, World!');
  });

  return app;
};

export default app;
```

```ts
// src/server.ts
import app from './app';

const start = async () => {
  const server = await app();

  try {
    server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
```

## WebSocket

```sh
$ npm i nodemon vite-node -D
# or
$ yarn add nodemon vite-node -D
# or
$ pnpm i nodemon vite-node -D
# or
$ bun add nodemon vite-node -D
```

```diff
- "dev": "vite",
+ "dev": "nodemon -e \"js,ts,mjs,mts,json,json5\" -x \"vite-node ./src/server.ts\" -w \"src/**/*\"",
```
