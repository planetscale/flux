import Image from 'next/image';
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

  > img {
    position: absolute;
    top: 0;
    left: 0;
    margin: 20px 0 0 25px;
  }

  > button {
    border: none;
    background-color: unset;
    cursor: pointer;

    &:focus {
      outline: none;
    }
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
      <img src="/icon.svg" alt="parallax logo" />
      {!authContext.isAuthed && (
        <Image src="/login.svg" alt="login picture" layout="fill" />
      )}

      {!authContext.isAuthed && (
        <button onClick={handleLogin} type="button">
          <Image
            src="/google_login.svg"
            alt="login button"
            width={54}
            height={54}
          />
        </button>
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
