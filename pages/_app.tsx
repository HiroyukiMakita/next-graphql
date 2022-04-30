import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';
import type { AppProps } from 'next/app';
import React, { Dispatch, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay-ts';

/**
 * context を使用してグローバルなステートを保持させる
 * https://ja.reactjs.org/docs/context.html
 */
export const AppContext = React.createContext(
  {} as {
    loading: boolean;
    setLoading: Dispatch<React.SetStateAction<boolean>>;
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  /**
   * 子コンポーネントで、useContext(AppContext) で使う
   */
  const [loading, setLoading] = useState(false);

  return (
    <LoadingOverlay active={loading} spinner text='Now Loading...'>
      {/* 各コンポーネントからApolloClientを使用してGraphQLクエリを送ることができるようになる */}
      <ApolloProvider client={apolloClient}>
        <AppContext.Provider value={{ loading, setLoading }}>
          <Component {...pageProps} />;
        </AppContext.Provider>
      </ApolloProvider>
    </LoadingOverlay>
  );
}

export default MyApp;
