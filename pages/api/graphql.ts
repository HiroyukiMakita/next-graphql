import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../graphql/schema';
import Cors from 'micro-cors';
import { createContext } from '../../graphql/context';
import { GraphQLSchema } from 'graphql';
import { json } from 'micro';

// Apollo Studio を使えるように CORS の設定をする
const cors = Cors();

const apolloServer = new ApolloServer({
  //   typeDefs,
  //   resolvers,
  schema: schema as unknown as GraphQLSchema,
  // Prisma を指定するためのコンテキスト
  context: createContext,
});
const startServer = apolloServer.start();

export default cors(async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;
  await json(req, { limit: '1GB' });
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
});

// body-perser のデフォルト設定を false にして、GraphQL を使えるように設定
export const config = {
  api: {
    bodyParser: false,
  },
};
