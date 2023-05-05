import type { Plugin } from 'vite';
import type { FastifyServerOptions } from 'fastify';
import { spawn } from 'child_process';
import path from 'path';

export interface VitePluginFastifyOptions {
  appPath?: string;
  serverPath?: string;
  devMode?: boolean;
  fastify?: FastifyServerOptions;
}

export default (options: VitePluginFastifyOptions = {}): Plugin => {
  const {
    appPath = path.resolve(process.cwd(), './src/app.ts'),
    serverPath = path.resolve(process.cwd(), './src/server.ts'),
    devMode = true,
    fastify,
  } = options;

  return {
    name: 'vite-plugin-fastify',
    config(config, { command }) {
      const entry = command === 'build' ? serverPath : appPath;
      if (!config.build) config.build = {};
      if (!config.build.ssr) config.build.ssr = true;
      if (!config.build.rollupOptions) config.build.rollupOptions = {};
      if (!config.build.rollupOptions.input) config.build.rollupOptions.input = entry;

      if (!config.preview) config.preview = {};
      if (!config.preview.proxy) config.preview.proxy = {};

      if (!config.preview.proxy['/']) {
        config.preview.proxy['/'] = {
          target: `http://${config.server?.host}:${config.server?.port}`,
        };
      }
    },
    configureServer(server) {
      if (devMode) {
        server.middlewares.use(async (req, res) => {
          const appModule = await server.ssrLoadModule(appPath);

          let app = appModule.default;

          if (!app) {
            server.config.logger.error(`export 'default' was not found in '${appPath}'`);
            process.exit(1);
          } else {
            app = await app({
              logger: {
                transport: {
                  target: '@fastify/one-line-logger',
                },
              },
              ...fastify,
            });

            await app.ready();
            app.routing(req, res);
          }
        });
      }
    },
    configurePreviewServer() {
      spawn('node', ['dist/server.mjs'], {
        stdio: 'inherit',
      });
    },
  };
};
