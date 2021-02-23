import Head from 'next/head';
import { useUserContext } from 'state/user';

export default function CustomLayout({ children, title }) {
  const { user } = useUserContext();

  return (
    <>
      <Head>
        <title>
          Flux{' '}
          {user && title
            ? `- ${user.org.name} -
          ${title.charAt(0).toUpperCase() + title.slice(1)}`
            : '- Login'}
        </title>
        <meta property="og:title" content="{title}" key="title" />
      </Head>

      {children}
    </>
  );
}
