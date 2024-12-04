import { JWT } from '@fastify/jwt';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
    }
  }
}

export {};

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    authenticate: any
  }
};

type UserPayload = {
  id: string,
  email: string,
  name: string,
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload
  }
}