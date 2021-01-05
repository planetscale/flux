import { useEffect } from 'react';
import { Global, css } from '@emotion/react';
import { debugContextDevtool } from 'react-context-devtool';
import { AuthContextProvider } from 'state/auth';
import AppContainer from 'components/AppContainer';
import Head from 'next/head';

const initContextDevTools = () => {
  // eslint-disable-next-line no-underscore-dangle
  if (window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK) {
    // Only init dev tool when there's context dev tool extension installed in browser (https://www.npmjs.com/package/react-context-devtool#installation)
    const container = document.getElementById('__next');
    debugContextDevtool(container, {});
  }
};

function App({ Component, pageProps }) {
  useEffect(() => {
    initContextDevTools();
  }, []);

  return (
    <>
      <Head>
        <title>Parallax</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css?family=Inconsolata&display=swap');
          html,
          body {
            font-family: Inconsolata;
            margin: unset;
            width: 100vw;
            height: 100vh;
            overflow: auto;
          }
          input,
          select,
          textarea,
          button {
            font: unset;
            font-family: Inconsolata;
          }
        `}
      />
      <AuthContextProvider>
        <AppContainer>
          <Component {...pageProps} />
        </AppContainer>
      </AuthContextProvider>
    </>
  );
}

export default App;
