import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { initFirebase } from 'utils/fireConfig';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const firebase = initFirebase();
  }, []);

  return (
    <div>
      <Head>
        <title>Parallax</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}></main>
    </div>
  );
}
