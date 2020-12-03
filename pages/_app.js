import { useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(res => {
        console.log(res);
      });
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
