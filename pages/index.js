import PostList from 'components/PostList';
import { useQuery } from 'urql';
import gql from 'graphql-tag';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useEffect, useRef } from 'react';
import { useUserContext } from 'state/user';
import styled from '@emotion/styled';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { useImmer } from 'use-immer';
import LoadingIndicator from 'components/LoadingIndicator';

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

// TODO: only get current org's data
const postListQuery = gql`
  query($id: Int!, $last: Int!, $before: Int) {
    org(where: { id: $id }) {
      lenses {
        name
        posts(last: $last, before: { id: $before }) {
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

const DEFAULT_PAGE_ADDEND = 10;

export default function Home({ href, ...props }) {
  const [state, setState] = useImmer({
    postList: [],
    last: DEFAULT_PAGE_ADDEND,
    before: -1,
  });
  const { setHeaders } = useTopBarActions();
  const { user } = useUserContext();
  const { subHeader } = useTopBarContext();
  const isLoading = useRef(true);
  const [postListResult, runPostListQuery] = useQuery({
    query: postListQuery,
    variables: {
      id: user?.org?.id,
      last: state.last,
      before: state.before,
    },
  });

  useEffect(() => {
    if (postListResult.data?.org) {
      setState(draft => {
        draft.postList = state.postList.length
          ? [
              ...draft.postList,
              ...getLensPosts(postListResult.data?.org?.lenses, subHeader),
            ]
          : getLensPosts(postListResult.data?.org?.lenses, subHeader);
      });
      isLoading.current = false;
    } else {
      isLoading.current = true;
    }
  }, [postListResult.data?.org]);

  useBottomScrollListener(
    () => {
      if (state.postList.length) {
        setState(draft => {
          draft.before = state.postList[state.postList.length - 1].id;
        });
      }
    },
    {
      offset: 100,
      debounce: 300,
      DebounceOptions: { leading: false },
    }
  );

  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
      });
    }
  }, [user?.org]);

  return (
    <HomeWrapper>
      {isLoading.current ? (
        <LoadingIndicator></LoadingIndicator>
      ) : (
        <PostList posts={state.postList} />
      )}
    </HomeWrapper>
  );
}
