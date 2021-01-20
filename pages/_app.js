import { useEffect } from 'react';
import { Global, css } from '@emotion/react';
import { debugContextDevtool } from 'react-context-devtool';
import { AuthContextProvider } from 'state/auth';
import AppContainer from 'components/AppContainer';
import Head from 'next/head';
import { initTheme } from 'pageUtils/post/theme';
import './styles.css';

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
    initTheme();
  }, []);

  return (
    <>
      <Head>
        <title>Flux</title>
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Raleway:ital,wght@1,900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Global
        styles={css`
          * {
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', sans-serif;
            margin: unset;
            width: 100vw;
            overflow: auto;
            background: var(--background);
            color: var(--text);
          }

          input,
          select,
          textarea,
          button {
            font: unset;
            font-family: 'Inter', sans-serif;
          }

          a:visited {
              color: var(--link);
            }
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
