import TopBar from 'components/TopBar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useTopBarActions } from 'state/topBar';
import { useUserContext } from 'state/user';

export default function AppContentWrapper({ children }) {
  const router = useRouter();
  const { user } = useUserContext();
  const { setHeaders } = useTopBarActions();
  const [session, loading] = useSession();

  useEffect(() => {
    if (router.pathname === '/new') {
      setHeaders({
        subHeader: 'Add post',
      });
    } else if (router.pathname === '/404') {
      setHeaders({
        subHeader: '404',
      });
    } else if (router.pathname.startsWith('/post')) {
      setHeaders({
        subHeader: `Post`,
        query: `${router.query.id}`,
      });
    } else {
      setHeaders({
        subHeader: 'Posts',
      });
    }
  }, [router.pathname]);

  return (
    <>
      {session && !loading && user && (
        <>
          <TopBar
            profileImg={user?.profile?.avatar ?? '/user_profile_icon.svg'}
            userDisplayName={user?.displayName}
            userHandle={user?.username}
          />
          {children}
        </>
      )}
    </>
  );
}
