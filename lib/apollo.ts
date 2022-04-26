import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  // GraphQL のエンドポイント
  uri: 'http://localhost:3000/api/graphql',
  // クエリの結果をキャッシュに保存してくれるようになる
  cache: new InMemoryCache(),
});

export default apolloClient;
