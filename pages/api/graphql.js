import { ApolloServer } from 'apollo-server-micro';
import { applyMiddleware } from 'graphql-middleware';
import { schema } from '../../graphql/schema';
import { createContext } from '../../graphql/context';
import { permissions } from 'graphql/permissions';
import microCors from 'micro-cors';

const cors = microCors({
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

const apolloServer = new ApolloServer({
  context: createContext,
  schema: applyMiddleware(schema, permissions),
  tracing: process.env.NODE_ENV === 'development',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = apolloServer.createHandler({
  path: '/api/graphql',
});

module.exports = cors(handler);
