import PostList from 'components/PostList';
import { useClient } from 'urql';
import gql from 'graphql-tag';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useEffect, useRef, useState } from 'react';
import { useUserContext } from 'state/user';
import styled from '@emotion/styled';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { useImmer } from 'use-immer';
import { media } from 'pageUtils/post/theme';

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;

  ${media.phone`
    width: 100%;
  `}
`;

// TODO: only get current org's data
const postListQuery = gql`
  query($id: Int!, $last: Int!, $before: Int, $tag: String) {
    org(where: { id: $id }) {
      lenses {
        name
        posts(last: $last, before: { id: $before }, tag: $tag) {
          id
          title
          summary
          tag {
            name
          }
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

  if (subHeader.toLowerCase() === 'posts') {
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

const LOADING_POSTS = Array(10).fill(null);

export default function Home({ href, ...props }) {
  const [state, setState] = useImmer({
    postList: {},
    last: DEFAULT_PAGE_ADDEND,
    before: -1,
  });
  const { setHeaders, setTag } = useTopBarActions();
  const { user } = useUserContext();
  const { subHeader, selectedTag } = useTopBarContext();
  const [isLoading, setLoading] = useState(false);
  const client = useClient();

  useEffect(() => {
    fetchPost();
  }, [selectedTag, state.before, subHeader]);

  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
      });
    }
  }, [user?.org]);

  useEffect(() => {
    if (!selectedTag) {
      setState(draft => {
        draft.postList = {};
        draft.before = -1;
      });
    }
  }, [selectedTag]);

  useBottomScrollListener(
    () => {
      if (Object.keys(state.postList).length && !isLoading) {
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

  const fetchPost = async () => {
    setLoading(true);
    try {
      const result = await client
        .query(postListQuery, {
          id: user?.org?.id,
          last: state.last,
          before: state.before,
          tag: selectedTag,
        })
        .toPromise();

      setState(draft => {
        if (result.data?.org) {
          const mappedPosts = getLensPosts(
            result.data?.org?.lenses,
            subHeader
          ).reduce((acc, curr) => {
            acc[curr.id] = { ...curr };
            return acc;
          }, {});

          setState(draft => {
            draft.postList = { ...state.postList, ...mappedPosts };
          });
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const handleTagClick = (e, tagName) => {
    e.stopPropagation();

    if (tagName) {
      setState(draft => {
        draft.postList = {};
        draft.before = -1;
      });
      setTag(tagName);
    }
  };

  return (
    <HomeWrapper>
      <PostList
        posts={[
          ...Object.values(state.postList).reverse(),
          ...(isLoading ? LOADING_POSTS : []),
        ]}
        handleTagClick={handleTagClick}
      />
    </HomeWrapper>
  );
}
