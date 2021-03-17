import Head from 'next/head';
import { useUserContext } from 'state/user';

export default function CustomLayout({ children, title }) {
  const { user } = useUserContext();
  const orgPart = user?.org.name ? ` - ${user.org.name}` : '';

  return (
    <>
      <Head>
        <title>
          Flux
          {user && title
            ? `${orgPart} -
          ${title.charAt(0).toUpperCase() + title.slice(1)}`
            : '- Login'}
        </title>
        <meta property="og:title" content="{title}" key="title" />
      </Head>

      {children}
    </>
  );
}
