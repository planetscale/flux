import useSWR from 'swr';
import { defaultFetchHeaders } from 'utils/auth/clientConfig';
import PostList from 'components/PostList';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useEffect } from 'react';
import { useUserContext } from 'state/user';
import styled from '@emotion/styled';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { useImmer } from 'use-immer';
import { media } from 'pageUtils/post/theme';

const fetcher = async (url, auth, last, before, _) => {
  const params = new URLSearchParams({
    last,
    before,
  });
  const response = await fetch(`${url}?${params}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: auth,
    },
  });
  return response.json();
};

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;

  ${media.phone`
    width: 100%;
  `}
`;

const DEFAULT_PAGE_ADDEND = 10;

const LOADING_POSTS = Array(10).fill(null);

export default function Home({ href, ...props }) {
  const [state, setState] = useImmer({
    postList: {},
    last: DEFAULT_PAGE_ADDEND,
    before: -1,
    forceFetch: 0,
  });

  const { data } = useSWR(
    [
      '/api/get-posts',
      defaultFetchHeaders.authorization,
      state.last,
      state.before,
      state.forceFetch,
    ],
    fetcher,
    {
      onSuccess: data => {
        const mappedPosts = data.reduce((acc, curr) => {
          // FIXME: Update when PostList is updated with new format
          acc[curr.id] = {
            ...curr,
            tag: { name: curr.tagName },
            author: { displayName: curr.authorName },
          };
          delete acc[curr.id].tagName;
          delete acc[curr.id].authorName;
          return acc;
        }, {});

        setState(draft => {
          draft.postList = { ...state.postList, ...mappedPosts };
        });
      },
    }
  );
  const { setHeaders, setTag } = useTopBarActions();
  const { user } = useUserContext();
  const { selectedTag } = useTopBarContext();

  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
      });
    }
  }, [user?.org]);

  // This effect will handle triggering the fetchPost effect when the tag is changed.
  useEffect(() => {
    // The useBottomScrollListener will fire unecessarily if we are still scrolled to the bottom as we reset the post list.
    window.scrollTo(0, 0);
    setState(draft => {
      draft.postList = {};
      draft.before = -1;
      draft.forceFetch = draft.forceFetch + 1;
    });
  }, [selectedTag]);

  useBottomScrollListener(
    () => {
      const postLength = Object.keys(state.postList).length;
      if (postLength && data) {
        setState(draft => {
          // We can garuntee the object is sorted by id ASC, so the oldest post is first element
          draft.before = Number(Object.keys(state.postList)[0]);
        });
      }
    },
    {
      offset: 100,
      debounce: 300,
      DebounceOptions: { leading: false },
    }
  );

  const handleTagClick = (e, tagName) => {
    e.stopPropagation();

    if (tagName) {
      setTag(tagName);
    }
  };

  return (
    <HomeWrapper>
      <PostList
        posts={[
          ...Object.values(state.postList).reverse(),
          ...(!data ? LOADING_POSTS : []),
        ]}
        handleTagClick={handleTagClick}
      />
    </HomeWrapper>
  );
}
