import useSWR from 'swr';
import PostList from 'components/PostList';
import { useTopBarActions } from 'state/topBar';
import { useEffect } from 'react';
import { useUserContext } from 'state/user';
import styled from '@emotion/styled';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { useImmer } from 'use-immer';
import { media } from 'pageUtils/post/theme';
import { fetcher } from 'utils/fetch';
import CustomLayout from 'components/CustomLayout';

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;

  ${media.phone`
    width: 100%;
  `}
`;

const DEFAULT_PAGE_ADDEND = 10;

const LOADING_POSTS = Array(10).fill(null);

const formatPosts = posts => {
  const mappedPosts = (posts || []).reduce((acc, curr) => {
    // FIXME: Update when PostList is updated with new format
    acc[curr.id] = {
      ...curr,
      author: { displayName: curr.authorName },
    };
    delete acc[curr.id].authorName;
    return acc;
  }, {});

  return mappedPosts;
};

export default function Home() {
  const [state, setState] = useImmer({
    postsLoading: false,
    postList: {},
    last: DEFAULT_PAGE_ADDEND,
    before: -1,
  });

  const { setHeaders } = useTopBarActions();
  const { user } = useUserContext();

  const { data } = useSWR(
    ['/api/get-posts', state.last, state.before],
    (url, last, before) => {
      setState(draft => {
        draft.postsLoading = true;
      });
      return fetcher('GET', url, { last, before });
    },

    {
      onSuccess: data => {
        setState(draft => {
          draft.postList = { ...state.postList, ...formatPosts(data) };
          draft.postsLoading = false;
        });
      },
    }
  );

  if (data && data.length && Object.values(state.postList).length === 0) {
    setState(draft => {
      draft.postList = formatPosts(data);
    });
  }
  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
      });
    }
  }, [user?.org]);

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

  const posts = Object.values(state.postList).reverse();
  return (
    <CustomLayout title="Posts">
      <HomeWrapper>
        <PostList
          posts={[...posts, ...(state.postsLoading ? LOADING_POSTS : [])]}
        />
      </HomeWrapper>
    </CustomLayout>
  );
}
