# vite-plugin-fastify

Fastify plugin for Vite with Hot-module Replacement.

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

### Add Scripts

Add the following scripts to your `package.json` file:

```json
{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
  // ...
}
```

### Configuration

Add the following configuration to your `vite.config.ts`:

```ts
// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import fastify from 'vite-plugin-fastify';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  plugins: [
    fastify({
      appPath: './src/app.ts', // Default: <rootDir>/src/app.ts
      serverPath: './src/server.ts', // Default: <rootDir>/src/server.ts
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
import fastify from 'fastify';

export default () => {
  const app = fastify();

  app.get('/api/hello-world', async (req, reply) => {
    return reply.send('Hello, World!');
  });

  return app;
};
```

```ts
// src/server.ts
import app from './app';

const server = app();

const start = () => {
  try {
    await server.listen({ host: '127.0.0.1', port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
```

## Known Issues

This plugin does not support WebSocket.

For a workaround, use `vite-node` for development:

```diff
- "dev": "vite",
+ "dev": "vite-node -w src/server.ts",
```

Set to `false` to disable HMR during development:

```diff
  plugins: [
    fastify({
+     devMode: false,
    }),
  ],
```

Add `import.meta.hot` support to vite-node for HMR:

```diff
const start = async () => {
  try {
    await server.listen({ host: '127.0.0.1', port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

+ if (import.meta.hot) {
+   import.meta.hot.on('vite:beforeFullReload', async () => {
+     await server.close();
+   });

+   import.meta.hot.dispose(async () => {
+     await server.close();
+   });
+ }
};
```

See the [`examples`](./examples) folder for more details.

## File-based Routing

- [vite-plugin-fastify-routes](https://github.com/Vanilla-IceCream/vite-plugin-fastify-routes)
