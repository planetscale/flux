import styled from '@emotion/styled';
import { media } from 'pageUtils/post/theme';
import { useAuthActions, useAuthContext } from 'state/auth';
import CreateOrg from 'components/CreateOrg';
import { useUserContext, useUserActions } from 'state/user';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icon } from 'pageUtils/post/atoms';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: url('/bg_starfield.png') #131516;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.phone`
    width: 100%;
  `}
`;

const LogoContainer = styled.div`
  margin-bottom: 2em;
`;

const Logo = styled.img``;

const AuthButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  max-width: 480px;
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

export default function Login({ token }) {
  const { userLogin } = useAuthActions();
  const { user, loaded, isLoading } = useUserContext();
  const { isAuthed, authChecked, user: authUser } = useAuthContext();
  const { getUser } = useUserActions();
  const router = useRouter();

  useEffect(() => {
    if (isAuthed && token && user?.org) {
      router.push('/');
    }
  }, [isAuthed, token, user]);

  useEffect(() => {
    if (isAuthed && token && !isLoading) {
      getUser();
    }
  }, [token]);

  const handleLogin = () => {
    userLogin();
  };

  return (
    <Wrapper>
      <ContentContainer>
        <LogoContainer>
          <Logo src="/logo_flux.svg" alt="Flux logo"></Logo>
        </LogoContainer>
        {!isAuthed && authChecked && (
          <AuthButtonContainer>
            <AuthButton onClick={handleLogin}>
              <Icon className="icon-google"></Icon>
              <span>Login With Google</span>
            </AuthButton>
          </AuthButtonContainer>
        )}
        {isAuthed && loaded && !user?.org && (
          <CreateOrg
            name={authUser?.displayName}
            email={authUser?.email}
            avatar={authUser?.photoURL ?? ''}
          />
        )}
      </ContentContainer>
    </Wrapper>
  );
}
