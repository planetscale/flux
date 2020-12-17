import Head from 'next/head';
import styled from '@emotion/styled';
import Navbar from 'components/NavBar';
import PostList from 'components/PostList';
import TopBar from 'components/TopBar';
import { useAuthActions, useAuthContext } from 'state/auth';
import { useEffect } from 'react';
import { setFireAuthObserver } from 'utils/auth/clientConfig';
import { useQuery } from 'urql';
import { useUserContext } from 'state/user';

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

const sideNavDataQuery = `
  query {
    orgs {
      name
      lenses {
        name
      }
    }
  }
`;

// TODO: only get current org's data
const postListQuery = `
  query {
    orgs {
      lenses {
        posts {
          name
          author {
            displayName
          }
          createdAt
          replies {
            id
          }
        }
      }
    }
  }
`;

export default function Home({ href, ...props }) {
  const authContext = useAuthContext();
  const { rehydrateUser } = useAuthActions();
  const { user } = useUserContext();
  const [sideNavResult, runSideNavDataQuery] = useQuery({
    query: sideNavDataQuery,
  });
  const [postListResult, runPostListQuery] = useQuery({
    query: postListQuery,
  });

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
            <Navbar orgs={sideNavResult.data?.orgs} />
            <CenterWrapper>
              <TopBar
                org={user?.org.name}
                subOrg="Engineering"
                profileImg={user?.profile?.avatar ?? '/user_profile_icon.png'}
                userDisplayName={user?.displayName}
                userHandle={user?.username}
              />
              <PostList posts={postListResult.data?.orgs?.lenses?.posts} />
            </CenterWrapper>
          </MainWrapper>
        )}
      </main>
    </div>
  );
}
