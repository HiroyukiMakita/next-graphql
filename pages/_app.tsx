import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  // 各コンポーネントからApolloClientを使用してGraphQLクエリを送ることができるようになる
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />;
    </ApolloProvider>
  );
}

export default MyApp;
