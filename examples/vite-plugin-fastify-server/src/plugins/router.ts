import plugin from 'fastify-plugin';

export default plugin(
  async (app, opts) => {
    const { prefix } = opts;

    app.register(import('~/routes/hello'), { prefix: prefix + '/hello' });
  },
  { name: 'router' },
);
