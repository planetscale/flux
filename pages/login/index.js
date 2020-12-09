import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { useAuthActions, useAuthContext } from 'state/auth';
import UserSettings from 'components/UserSettings';
import PostUpload from 'components/PostUpload';

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
    <Wrapper>
      <img src="/icon.svg" alt="parallax logo" />
      {/* <Image src="/login.svg" alt="login picture" layout="fill" />
      <button onClick={handleLogin} type="button">
        <Image
          src="/google_login.svg"
          alt="login button"
          width={54}
          height={54}
        />
      </button> */}
      {/* <UserSettings /> */}
      <PostUpload />
    </Wrapper>
  );
}
