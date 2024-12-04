import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { userRoutes } from './modules/user/user.route';
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import fastifyJwt, { FastifyJWT } from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

const app = Fastify({
  logger: true,
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app
  .withTypeProvider<ZodTypeProvider>()
  .register(userRoutes, { prefix: 'api/users' });

app.register(fastifyJwt, { secret: process.env.JWT_SECRET });

app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.cookies.access_token;

  if (!token) {
    return reply.status(401).send({ message: 'Authentication required' });
  }

  const decoded = req.jwt.verify<FastifyJWT['user']>(token)
  req.user = decoded;
});

app.addHook('preHandler', (req, res, next) => {
  req.jwt = app.jwt;
  return next();
});

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

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
});