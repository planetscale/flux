import { useEffect } from 'react';
import { Global, css } from '@emotion/react';
import { useRouter } from 'next/router';
import { debugContextDevtool } from 'react-context-devtool';
import { AuthContextProvider } from 'state/auth';
import { setFireAuthObserver } from 'utils/fireConfig';

const initContextDevTools = () => {
  // eslint-disable-next-line no-underscore-dangle
  if (window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK) {
    // Only init dev tool when there's context dev tool extension installed in browser (https://www.npmjs.com/package/react-context-devtool#installation)
    const container = document.getElementById('__next');
    debugContextDevtool(container, {});
  }
};

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    initContextDevTools();
    setFireAuthObserver(directToLogin);
  }, []);

  const directToLogin = () => {
    router.push('/login');
  };

  return (
    <>
      <Global
        styles={css`
          html,
          body {
            font-family: Inconsolata;
            margin: unset;
          }
          font-family: Inconsolata;
        `}
      />
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </>
  );
}

export default App;
