import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useAuthContext } from 'state/auth';
import { useUserActions, useUserContext } from 'state/user';

export default function AuthGuard({ token, children }) {
  const router = useRouter();
  const { isAuthed, authChecked, user: authUser } = useAuthContext();
  const { user, loaded } = useUserContext();
  const { getUser } = useUserActions();
  const prevPathRef = useRef(null);
  const currPathRef = useRef(null);

  useEffect(() => {
    prevPathRef.current = currPathRef.current;
    currPathRef.current = router.pathname;
  });

  useEffect(() => {
    if (
      (isAuthed && token) ||
      (isAuthed &&
        token &&
        prevPathRef.current === '/login' &&
        currPathRef.current === '/')
    ) {
      getUser();
    }
  }, [isAuthed, token, prevPathRef.current, currPathRef.current]);

  useEffect(() => {
    if (isAuthed && loaded && user && router.pathname === '/login') {
      router.push('/');
    } else if (
      (!isAuthed && authChecked) ||
      (isAuthed && authChecked && loaded && !user)
    ) {
      router.push('/login');
    }
  }, [isAuthed, user, loaded, authChecked]);

  return <>{children}</>;
}
