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
  query($id: Int!) {
    org(where: { id: $id }) {
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
    return lenses
      .flatMap(lens => lens.posts)
      .sort((a, b) => {
        return b.id - a.id;
      });
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
  const { setHeaders } = useTopBarActions();
  const { user } = useUserContext();
  const { subHeader } = useTopBarContext();
  const [postListResult, runPostListQuery] = useQuery({
    query: postListQuery,
    variables: {
      id: user?.org?.id,
    },
  });

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
        posts={getLensPosts(postListResult.data?.org?.lenses, subHeader)}
      />
    </HomeWrapper>
  );
}
