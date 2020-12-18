import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthContext } from 'state/auth';
import { useUserActions, useUserContext } from 'state/user';

export default function AuthGuard({ token, children }) {
  const router = useRouter();
  const { isAuthed, user: authUser } = useAuthContext();
  const { user, loaded } = useUserContext();
  const { getUser } = useUserActions();

  useEffect(async () => {
    if (isAuthed && token) {
      getUser({
        email: authUser?.email,
      });
    }
  }, [isAuthed, token]);

  useEffect(() => {
    console.log(isAuthed, loaded, user);
    if (isAuthed && user) {
      router.push('/');
    } else if (!isAuthed || (isAuthed && loaded && !user)) {
      router.push('/login');
    }
  }, [isAuthed, user, loaded]);

  return <>{children}</>;
}
