import { signIn } from 'next-auth/client';
import styled from '@emotion/styled';
import { Icon } from 'pageUtils/post/atoms';

const AuthButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  max-width: 480px;
  margin-top: 2em;
`;

const AuthButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid white;
  background-color: #060a0c;
  border-radius: 99px;
  padding: 16px;
  outline: unset;
  box-shadow: var(--shadow);
  transition: all 300ms;
  color: white;

  &:hover {
    transform: scale(0.99);
  }

  &:active {
    transform: scale(0.97);
  }

  > ${Icon} {
    background: white;
  }

  > span {
    border-left: 1px solid var(--accent);
    padding: 0 8px;
    margin-left: 8px;
    text-transform: uppercase;
  }
`;

export default function Google() {
  const handleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <AuthButtonContainer>
      <AuthButton onClick={handleLogin}>
        <Icon className="icon-google"></Icon>
        <span>Login With Google</span>
      </AuthButton>
    </AuthButtonContainer>
  );
}
