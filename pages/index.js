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
    forceFetch: 0,
  });
  const { setHeaders, setTag } = useTopBarActions();
  const { user } = useUserContext();
  const { subHeader, selectedTag } = useTopBarContext();
  const [isLoading, setLoading] = useState(false);
  const client = useClient();

  // We want to fetch new posts when:
  // - The pagination (before) changes
  // - The subheader changes
  // - A force fetch has triggered. This is probably a useEffect anti-patern but a way to trigger fetches on our terms.
  //   We don't want to listen for a selectedTag change here directly because we have another effect below that handles it
  //   and we don't want to fire double queries.
  useEffect(() => {
    // Skip initial render for this effect, the selectTag effect will trigger this again.
    if (state.forceFetch === 0) return;
    fetchPost();
  }, [state.forceFetch, state.before, subHeader]);

  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
      });
    }
  }, [user?.org]);

  // This effect will handle triggering the fetchPost effect when the tag is changed.
  useEffect(() => {
    setLoading(true);
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
      if (postLength && !isLoading) {
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
