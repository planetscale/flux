import { useEffect, useState } from 'react';
import { Global, css } from '@emotion/react';
import { useRouter } from 'next/router';
import { debugContextDevtool } from 'react-context-devtool';
import { AuthContextProvider } from 'state/auth';
import { UserContextProvider } from 'state/user';
import { setFireAuthObserver } from 'utils/auth/clientConfig';
import { createClient, Provider, fetchExchange, cacheExchange } from 'urql';
import { AuthGuard } from 'components/AuthGuard';

const initContextDevTools = () => {
  // eslint-disable-next-line no-underscore-dangle
  if (window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK) {
    // Only init dev tool when there's context dev tool extension installed in browser (https://www.npmjs.com/package/react-context-devtool#installation)
    const container = document.getElementById('__next');
    debugContextDevtool(container, {});
  }
};

// the URL to /api/graphql
const GRAPHQL_ENDPOINT = `http://localhost:3000/api/graphql`;

const createUrqlClient = token => {
  return createClient({
    url: GRAPHQL_ENDPOINT,
    fetchOptions: () => {
      return {
        headers: { authorization: token ? `Bearer ${token}` : '' },
      };
    },
    // TODO: add dedupExchange to this array and check cache before fire api request
    exchanges: [cacheExchange, fetchExchange],
  });
};

function App({ Component, pageProps }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [urqlClient, setUrqlClient] = useState(createUrqlClient(token));

  useEffect(() => {
    initContextDevTools();
    setFireAuthObserver(directToLogin, updateToken);
  }, []);

  useEffect(() => {
    setUrqlClient(createUrqlClient(token));
  }, [token]);

  const directToLogin = () => {
    router.push('/login');
  };

  const updateToken = async user => {
    try {
      const jwt = await user.getIdToken();
      setToken(jwt);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Global
        styles={css`
          html,
          body {
            font-family: Inconsolata;
            margin: unset;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
          }
        `}
      />
      <AuthContextProvider>
        <Provider value={urqlClient}>
          <UserContextProvider>
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          </UserContextProvider>
        </Provider>
      </AuthContextProvider>
    </>
  );
}

export default App;
