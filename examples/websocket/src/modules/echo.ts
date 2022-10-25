import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/', { websocket: true }, (con, req) => {
    con.socket.send('Hello from server!');

    con.socket.onmessage = (event: MessageEvent) => {
      console.log(event.data);
    };
  });
};
