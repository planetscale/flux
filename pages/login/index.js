import styled from '@emotion/styled';
import { useAuthActions, useAuthContext } from 'state/auth';

import CreateOrg from 'components/CreateOrg';
import { useUserContext } from 'state/user';

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
  width: 640px;
`;

const Logo = styled.img``;

const AuthButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  background-color: white;
  border-radius: 99px;
  padding: 16px;
  outline: unset;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 13px rgba(0, 0, 0, 0.08);
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

export default function Login() {
  const { userLogin } = useAuthActions();
  const authContext = useAuthContext();
  const userContext = useUserContext();

  const handleLogin = () => {
    userLogin();
  };

  return (
    <Wrapper>
      {!authContext.isAuthed && (
        <ContentContainer>
          <Logo src="/logo_white.svg" alt="Flux logo"></Logo>
          <AuthButton onClick={handleLogin}>
            <Logo
              src="/logo_google.svg"
              alt="login button"
              width={54}
              height={54}
            ></Logo>
            <span>Login With Google</span>
          </AuthButton>
        </ContentContainer>
      )}
      {authContext.isAuthed &&
        !userContext.loading &&
        !userContext.user?.org && (
          <CreateOrg
            name={authContext?.user?.displayName}
            email={authContext?.user?.email}
            avatar={authContext?.user?.photoURL ?? ''}
          />
        )}
    </Wrapper>
  );
}
