# vite-plugin-fastify

Fastify plugin for Vite.

## Install

```bash
$ npm i vite-plugin-fastify
# or
$ pnpm i vite-plugin-fastify
# or
$ yarn add vite-plugin-fastify
```

## Usage

```json5
// package.json

  "scripts": {
    // ...
    "dev": "vite",
    "build": "vite build",
    "preview": "node dist/server.mjs"
    // ...
  }
```

```ts
// vite.config.ts
import path from 'path';
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
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
```

```ts
// src/app.ts
import fastify from 'fastify';

const app = async (options = {}) => {
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
$ pnpm install nodemon vite-node -D
```

```diff
- "dev": "vite",
+ "dev": "nodemon -e \"js,ts,mjs,mts,json,json5\" -x \"vite-node ./src/server.ts\" -w \"src/**/*\"",
```
