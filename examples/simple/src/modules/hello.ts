import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/', async (req, reply) => {
    return reply.send('Hello, Fastify!');
  });
};
