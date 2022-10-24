import fastify from 'fastify';

import router from '~/plugins/router';
import websocket from '~/plugins/websocket';

const app = async (options = {}) => {
  const app = fastify(options);

  app.register(router, { prefix: '/api' });
  app.register(websocket, { prefix: '/io' });

  return app;
};

export default app;
