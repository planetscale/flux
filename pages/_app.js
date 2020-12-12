import { useEffect, useState } from 'react';
import { Global, css } from '@emotion/react';
import { useRouter } from 'next/router';
import { debugContextDevtool } from 'react-context-devtool';
import { AuthContextProvider } from 'state/auth';
import { setFireAuthObserver } from 'utils/fireConfig';
import { createClient, Provider } from 'urql';

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

function App({ Component, pageProps }) {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    initContextDevTools();
    setFireAuthObserver(directToLogin, updateToken);
  }, []);

  const directToLogin = () => {
    router.push('/login');
  };

  const updateToken = async user => {
    const jwt = await user.getIdToken();
    setToken(jwt);
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
        <Provider
          value={createClient({
            url: GRAPHQL_ENDPOINT,
            fetchOptions: () => {
              return {
                headers: { authorization: token ? `Bearer ${token}` : '' },
              };
            },
          })}
        >
          <Component {...pageProps} />
        </Provider>
      </AuthContextProvider>
    </>
  );
}

export default App;
