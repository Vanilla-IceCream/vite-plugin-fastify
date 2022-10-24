import fastify from 'fastify';

const app = async (options = {}) => {
  const app = fastify(options);

  app.get('/hello', async () => {
    return 'Hello, Fastify!';
  });

  return app;
};

export default app;
