import Head from 'next/head';
import styled from '@emotion/styled';
import Navbar from 'components/NavBar';
import PostList from 'components/PostList';
import TopBar from 'components/TopBar';
import { useAuthActions, useAuthContext } from 'state/auth';
import { useEffect } from 'react';
import { setFireAuthObserver } from 'utils/auth/clientConfig';
import PostPage from './post';

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
`;
const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

export default function Home({ href, ...props }) {
  const authContext = useAuthContext();
  const { rehydrateUser } = useAuthActions();

  useEffect(() => {
    setFireAuthObserver(null, rehydrateUser);
  }, []);

  return (
    <div>
      <Head>
        <title>Parallax</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {authContext.isAuthed && (
          <MainWrapper>
            <Navbar />
            <CenterWrapper>
              <TopBar />
              {/* <PostList /> */}
              <PostPage />
            </CenterWrapper>
          </MainWrapper>
        )}
      </main>
    </div>
  );
}
