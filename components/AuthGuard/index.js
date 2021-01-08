import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthContext } from 'state/auth';
import { useUserActions, useUserContext } from 'state/user';

export default function AuthGuard({ token, children }) {
  const router = useRouter();
  const { isAuthed, authChecked, user: authUser } = useAuthContext();
  const { user, loaded } = useUserContext();
  const { getUser } = useUserActions();

  useEffect(async () => {
    console.log(isAuthed, token);
    if (isAuthed && token) {
      getUser({
        email: authUser?.email,
      });
    }
  }, [isAuthed, token, router.pathname]);

  useEffect(() => {
    if (isAuthed && loaded && user) {
      router.push('/');
    } else if ((!isAuthed && authChecked) || (isAuthed && loaded && !user)) {
      router.push('/login');
    }
  }, [isAuthed, user, loaded, authChecked]);

  return <>{children}</>;
}
