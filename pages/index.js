import Head from 'next/head';
import PostList from 'components/PostList';
import { useQuery } from 'urql';
import gql from 'graphql-tag';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useEffect } from 'react';
import { useUserContext } from 'state/user';
import styled from '@emotion/styled';

const HomeWrapper = styled.div`
  overflow-y: auto;
`;

// TODO: only get current org's data
const postListQuery = gql`
  query {
    orgs {
      lenses {
        name
        posts {
          id
          title
          author {
            displayName
          }
          createdAt
          replies {
            id
          }
          stars {
            id
          }
        }
      }
    }
  }
`;

// TODO: replace this hack with backend implementation
function getLensPosts(lenses, subHeader) {
  if (lenses === undefined || lenses === null) {
    return [];
  }

  if (subHeader === '') {
    return lenses.flatMap(lens => lens.posts);
  }

  const lens = lenses.find(lens => {
    return lens.name !== undefined && lens.name === subHeader;
  });

  if (lens === undefined) {
    return [];
  }

  return lens.posts;
}

export default function Home({ href, ...props }) {
  const [postListResult, runPostListQuery] = useQuery({
    query: postListQuery,
  });
  const { setHeaders } = useTopBarActions();
  const { user } = useUserContext();
  const { subHeader } = useTopBarContext();

  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
        subHeader: '',
      });
    }
  }, [user?.org]);

  return (
    <HomeWrapper>
      <Head>
        {/* //TODO: Add custom title to each page, probably more link to a custom `Document` */}
        <title>Parallax</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <PostList
          posts={getLensPosts(postListResult.data?.orgs?.[0].lenses, subHeader)}
        />
      </main>
    </HomeWrapper>
  );
}
