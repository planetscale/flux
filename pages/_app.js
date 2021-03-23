import { useEffect } from 'react';
import { Provider } from 'next-auth/client';
import { debugContextDevtool } from 'react-context-devtool';
import AppContainer from 'components/AppContainer';
import { initTheme } from 'pageUtils/post/theme';
import Head from 'next/head';
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta>
        <link rel="icon" href="/favicon.svg" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,900&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Provider session={pageProps.session}>
        <AppContainer>
          <Component {...pageProps} />
        </AppContainer>
      </Provider>
    </>
  );
}

export default App;
