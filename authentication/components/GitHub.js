import { signIn } from 'next-auth/client';
import { Github as RemixLineGithub } from '@styled-icons/remix-line';
import { ButtonWireframe } from 'components/Button';

export default function Google({ isPrimaryOAuth }) {
  console.log(isPrimaryOAuth);
  const handleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <ButtonWireframe onClick={handleLogin}>
      <RemixLineGithub />
      {isPrimaryOAuth && <span>Login with Github</span>}
    </ButtonWireframe>
  );
}
