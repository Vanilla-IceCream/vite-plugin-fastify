import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  // $ curl http://127.0.0.1:3000/api/hello
  app.get('', async (req, reply) => {
    return reply.send('Hello, Fastify!');
  });
};
