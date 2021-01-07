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
    if (isAuthed && authUser) {
      router.push('/');
    } else if (!isAuthed || (isAuthed && loaded && !authUser)) {
      router.push('/login');
    }
  }, [isAuthed, authUser, loaded]);

  return <>{children}</>;
}
