import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthActions, useAuthContext } from 'state/auth';

export default function Login() {
  const router = useRouter();
  const { userLogin } = useAuthActions();
  const authContext = useAuthContext();

  useEffect(() => {
    if (authContext.isAuthed) {
      router.push('/');
    }
  }, [authContext]);

  const handleLogin = () => {
    userLogin();
  };

  return (
    <button type="button" onClick={handleLogin}>
      login
    </button>
  );
}
