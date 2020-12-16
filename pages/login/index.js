import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { useAuthActions, useAuthContext } from 'state/auth';
import { useClient } from 'urql';
import gql from 'graphql-tag';
import CreateOrg from 'components/CreateOrg';

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

const userOrgQuery = gql`
  query($email: String!) {
    user(where: { email: $email }) {
      email
      displayName
      org {
        id
        name
      }
    }
  }
`;

const getUserOrgs = async (urqlClinet, { email }) => {
  return urqlClinet
    .query(userOrgQuery, {
      email,
    })
    .toPromise();
};

export default function Login() {
  const router = useRouter();
  const client = useClient();
  const { userLogin } = useAuthActions();
  const authContext = useAuthContext();
  const [state, setState] = useState(null);

  useEffect(() => {
    if (authContext.isAuthed) {
      getUserOrgs(client, { email: authContext?.user?.email })
        .then(res => {
          setState({
            user: res.data?.user,
          });
        })
        .catch(e => {
          console.error(e);
        });
    }
  }, [authContext]);

  useEffect(() => {
    if (state.user) {
      router.push('/');
    }
  }, [state]);

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
      {authContext.isAuthed && !state?.user && (
        <CreateOrg name={authContext?.user?.displayName} />
      )}
    </Wrapper>
  );
}
