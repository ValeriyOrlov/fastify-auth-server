import Fastify from 'fastify';

const app = Fastify({
  logger: true,
});

async function main() {
  await app.listen({
    port: 8000,
    host: '0.0.0.0',
  });
};

main();

app.get('/healthcheck', (_req, res) => {
  res.send({ message: 'Success' });
})