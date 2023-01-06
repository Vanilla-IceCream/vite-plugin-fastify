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
