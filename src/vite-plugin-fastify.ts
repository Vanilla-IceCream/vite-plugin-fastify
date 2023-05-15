import type { Plugin } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { mergeConfig } from 'vite';

export interface PluginOptions {
  appPath?: string;
  serverPath?: string;
  devMode?: boolean;
}

export default (options: PluginOptions = {}): Plugin => {
  const {
    appPath = path.resolve(process.cwd(), './src/app.ts'),
    serverPath = path.resolve(process.cwd(), './src/server.ts'),
    devMode = true,
  } = options;

  return {
    name: 'vite-plugin-fastify',
    config(config, { command }) {
      const entry = command === 'build' ? serverPath : appPath;

      const fileExtension = path.extname(serverPath);
      const fileName = path.basename(serverPath, fileExtension);

      const HOST = config.define?.['process.env.HOST']
        ? JSON.parse(config.define?.['process.env.HOST'])
        : config.server?.host;
      const PORT = config.define?.['process.env.PORT']
        ? JSON.parse(config.define?.['process.env.PORT'])
        : config.server?.port;

      return mergeConfig(config, {
        server: {
          host: HOST,
          port: PORT,
        },
        build: {
          ssr: true,
          rollupOptions: {
            input: {
              [fileName]: entry,
            },
          },
        },
        preview: {
          proxy: {
            '/': {
              target: `http://${HOST}:${PORT}/`,
            },
          },
        },
        clearScreen: false,
      });
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
            if (app.constructor.name === 'AsyncFunction') {
              app = await app();
            } else {
              app = app();
            }

            await app.ready();
            app.routing(req, res);
          }
        });
      }
    },
    configurePreviewServer() {
      const fileExtension = path.extname(serverPath);
      const fileName = path.basename(serverPath, fileExtension);

      spawn('node', [`dist/${fileName}.mjs`], {
        stdio: 'inherit',
      });
    },
  };
};
