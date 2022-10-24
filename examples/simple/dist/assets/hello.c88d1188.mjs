const hello = async (app) => {
  app.get("/", async (req, reply) => {
    return reply.send("Hello, Fastify!");
  });
};
export {
  hello as default
};
