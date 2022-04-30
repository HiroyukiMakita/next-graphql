import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';
import type { AppProps } from 'next/app';
import React, { Dispatch, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay-ts';
import { Toaster } from 'react-hot-toast';

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
    <>
      {/* 各コンポーネントからApolloClientを使用してGraphQLクエリを送ることができるようになる */}
      <ApolloProvider client={apolloClient}>
        <AppContext.Provider value={{ loading, setLoading }}>
          <LoadingOverlay active={loading} spinner text='Now Loading...'>
            <Component {...pageProps} />
            {/* react-toastify を使いたかったけどうまく表示されなかった。
            別のプロジェクトでは普通に使えたので謎。
            代わりに react-hot-toast を使用 */}
            <Toaster />
          </LoadingOverlay>
        </AppContext.Provider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
