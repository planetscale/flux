import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useUserActions, useUserContext } from 'state/user';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const {
    user,
    loaded: userLoaded,
    isLoading: isUserLoading,
  } = useUserContext();
  const { getUser } = useUserActions();
  const [session, loading] = useSession();

  useEffect(() => {
    if (session && !loading && !isUserLoading && !userLoaded) {
      getUser();
    }
  }, [session, loading, userLoaded]);

  useEffect(() => {
    if (!loading && (!session || (session && userLoaded && !user))) {
      router.push('/login');
    }
  }, [session, loading, user, userLoaded]);

  return user ? <>{children}</> : null;
}
