import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createUserResponseSchema, createUserSchema, loginResponseSchema, loginSchema } from "./user.schema";
import { createUser, getUsers, login } from "./user.controller";

export async function userRoutes(app: FastifyInstance) {
  app.get('/', 
    {
      preHandler: [app.authenticate],
    },
    getUsers,
  );

  app.post('/register', {
    schema: {
      body: createUserSchema,
      response: {
        201: createUserResponseSchema,
      },
    },
  },
    createUser,
  );

  app.post('/login', {
    schema: {
      body: loginSchema,
      response: {
        201: loginResponseSchema,
      },
    },
  },
  login,
);
  app.delete('/logout', () => {});
  app.log.info('user routes registered');
}