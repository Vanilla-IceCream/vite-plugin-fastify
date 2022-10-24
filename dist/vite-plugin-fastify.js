const d = (a) => {
  const { appPath: s, serverPath: i, fastify: u } = a;
  return {
    name: "vite-plugin-fastify",
    config(e, { command: l }) {
      const t = l === "build" ? i : s;
      e.build || (e.build = {}), e.build.ssr || (e.build.ssr = t), e.build.rollupOptions || (e.build.rollupOptions = {}), e.build.rollupOptions.input || (e.build.rollupOptions.input = t), e.server || (e.server = {}), e.server.hmr || (e.server.hmr = !1), e.server.host || (e.server.host = !0);
    },
    configureServer(e) {
      e.middlewares.use(async (l, t) => {
        let r = (await e.ssrLoadModule(s)).default;
        r ? (r = await r({
          logger: {
            transport: {
              target: "@fastify/one-line-logger"
            }
          },
          ...u
        }), await r.ready(), r.routing(l, t)) : (e.config.logger.error(`export 'default' was not found in '${s}'`), process.exit(1));
      });
    }
  };
};
export {
  d as default
};
