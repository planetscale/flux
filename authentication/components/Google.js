import { signIn } from 'next-auth/client';
import { Google as RemixLineGoogle } from '@styled-icons/remix-line';
import { ButtonWireframe } from 'components/Button';

export default function Google({ isPrimaryOAuth }) {
  const handleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <ButtonWireframe onClick={handleLogin}>
      <RemixLineGoogle />
      {isPrimaryOAuth && <span>Login with Google</span>}
    </ButtonWireframe>
  );
}
