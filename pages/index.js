import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initFirebase } from 'utils/fireConfig';

export default function Home({ href, ...props }) {
  const router = useRouter();

  useEffect(() => {
    initFirebase();
  }, []);

  const handleLogin = e => {
    e.preventDefault();
    console.log(router.pathname);
    router.push('/login');
  };

  return (
    <div>
      <Head>
        <title>Parallax</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <button type="button" onClick={handleLogin}>
          login
        </button>
      </main>
    </div>
  );
}
