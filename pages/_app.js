import { useEffect } from 'react';
import { Global, css } from '@emotion/react';

function App({ Component, pageProps }) {
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(res => {
        console.log(res);
      });
  }, []);

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
      <Component {...pageProps} />
    </>
  );
}

export default App;
