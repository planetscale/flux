import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthContext } from 'state/auth';
import { useUserActions, useUserContext } from 'state/user';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthed, authChecked } = useAuthContext();
  const { user, loaded } = useUserContext();
  const { getUser } = useUserActions();

  useEffect(() => {
    if (isAuthed && !user && !loaded) {
      getUser();
    }
  }, [isAuthed]);

  useEffect(() => {
    if (
      (!isAuthed && authChecked) ||
      (isAuthed && authChecked && loaded && !user)
    ) {
      router.push('/login');
    }
  }, [isAuthed, user, loaded, authChecked]);

  return user ? <>{children}</> : null;
}
