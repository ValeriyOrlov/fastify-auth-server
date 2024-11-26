import Fastify from 'fastify';
import { userRoutes } from './modules/user/user.route';
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

const app = Fastify({
  logger: true,
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app
  .withTypeProvider<ZodTypeProvider>()
  .register(userRoutes, { prefix: 'api/users' });

const listeners = ['SIGINT', 'SIGTERM'];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
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