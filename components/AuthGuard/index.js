import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthContext } from 'state/auth';
import { useUserActions, useUserContext } from 'state/user';

export function AuthGuard({ children }) {
  const router = useRouter();
  const authContext = useAuthContext();
  const userContext = useUserContext();
  const { getUserOrgs } = useUserActions();

  useEffect(async () => {
    if (authContext.isAuthed) {
      getUserOrgs({
        email: authContext?.user?.email,
      });
    }
  }, [authContext]);

  useEffect(() => {
    console.log(userContext, authContext);
    if (authContext.isAuthed && userContext?.user?.org) {
      router.push('/');
    } else {
      router.push('/login');
    }
  }, [userContext, authContext]);

  return <>{children}</>;
}
