import fastify from "fastify";
import plugin from "fastify-plugin";
import websocket$1 from "@fastify/websocket";
const router = plugin(
  async (app2, opts) => {
    const { prefix } = opts;
    app2.register(import("./assets/hello.c88d1188.mjs"), { prefix: prefix + "/hello" });
  },
  { name: "router" }
);
const websocket = plugin(
  async (app2, opts) => {
    const { prefix } = opts;
    app2.register(websocket$1);
    app2.register(import("./assets/echo.3ed9167b.mjs"), { prefix: prefix + "/echo" });
  },
  { name: "websocket" }
);
const app = async (options = {}) => {
  const app2 = fastify(options);
  app2.register(router, { prefix: "/api" });
  app2.register(websocket, { prefix: "/io" });
  return app2;
};
const start = async () => {
  const server = await app({
    logger: {
      transport: {
        target: "@fastify/one-line-logger"
      }
    }
  });
  try {
    server.listen({ port: 3e3 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
