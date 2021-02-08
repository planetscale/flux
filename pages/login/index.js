import styled from '@emotion/styled';
import { media } from 'pageUtils/post/theme';
import { useAuthActions, useAuthContext } from 'state/auth';
import CreateOrg from 'components/CreateOrg';
import { useUserContext, useUserActions } from 'state/user';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #353e58 0%, #c56a86 100%), #ffffff;

  > img {
    position: absolute;
    top: 0;
    left: 0;
    margin: 20px 0 0 25px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 90ch;

  ${media.phone`
    flex-direction: column;
    width: 100%;
  `}
`;

const LogoContainer = styled.div`
  ${media.phone`
    margin-bottom: 4em;
  `}
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
  border: none;
  background-color: white;
  border-radius: 99px;
  padding: 16px;
  outline: unset;
  box-shadow: var(--shadow);
  transition: all 300ms;

  &:hover {
    transform: scale(0.99);
  }

  &:active {
    transform: scale(0.97);
  }

  > img {
    width: 21px;
    height: auto;
  }

  > span {
    border-left: 1px solid #7d546f;
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
          <Logo src="/logo_white.svg" alt="Flux logo"></Logo>
        </LogoContainer>
        {!isAuthed && authChecked && (
          <AuthButtonContainer>
            <AuthButton onClick={handleLogin}>
              <Logo
                src="/logo_google.svg"
                alt="login button"
                width={54}
                height={54}
              ></Logo>
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
