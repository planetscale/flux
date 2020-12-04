import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import { initFirebase, loginWithFirebase } from 'utils/fireConfig';

export default function Home() {
  useEffect(() => {
    initFirebase();
  }, []);

  return (
    <div>
      <Head>
        <title>Parallax</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button
          type="button"
          onClick={() => {
            loginWithFirebase();
          }}
        >
          login
        </button>
      </main>
    </div>
  );
}
