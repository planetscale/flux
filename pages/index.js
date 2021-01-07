import PostList from 'components/PostList';
import { useQuery } from 'urql';
import gql from 'graphql-tag';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useEffect } from 'react';
import { useUserContext } from 'state/user';
import styled from '@emotion/styled';

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;
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
          summary
          author {
            displayName
          }
          createdAt
        }
      }
    }
  }
`;

// TODO: replace this hack with backend implementation
function getLensPosts(lenses, subHeader) {
  if (!lenses || lenses.length === 0) {
    return [];
  }

  if (subHeader.toLowerCase() === 'all') {
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
      });
    }
  }, [user?.org]);

  return (
    <HomeWrapper>
      <PostList
        posts={getLensPosts(postListResult.data?.orgs?.[0].lenses, subHeader)}
      />
    </HomeWrapper>
  );
}
