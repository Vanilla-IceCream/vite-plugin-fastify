import type { Plugin } from 'vite';
import type { FastifyServerOptions } from 'fastify';

export interface VitePluginFastifyOptions {
  appPath: string;
  serverPath: string;
  fastify?: FastifyServerOptions;
}

export default (options: VitePluginFastifyOptions): Plugin => {
  const { appPath, serverPath, fastify } = options;

  return {
    name: 'vite-plugin-fastify',
    config(config, { command }) {
      const entry = command === 'build' ? serverPath : appPath;

      if (!config.build) config.build = {};
      if (!config.build.ssr) config.build.ssr = entry;
      if (!config.build.rollupOptions) config.build.rollupOptions = {};
      if (!config.build.rollupOptions.input) config.build.rollupOptions.input = entry;

      if (!config.server) config.server = {};
      if (!config.server.hmr) config.server.hmr = false;
      if (!config.server.host) config.server.host = true;
    },
    configureServer(server) {
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
    },
  };
};
