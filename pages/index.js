import Head from 'next/head';
import PostList from 'components/PostList';
import { useQuery } from 'urql';
import gql from 'graphql-tag';
import { useTopBarActions } from 'state/topBar';
import { useEffect } from 'react';
import { useUserContext } from 'state/user';

// TODO: only get current org's data
const postListQuery = gql`
  query {
    orgs {
      lenses {
        posts {
          id
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
  const [postListResult, runPostListQuery] = useQuery({
    query: postListQuery,
  });
  const { setHeaders } = useTopBarActions();
  const { org } = useUserContext().user;

  useEffect(() => {
    if (org?.name) {
      setHeaders({
        header: org.name,
      });
    }
  }, [org]);

  return (
    <div>
      <Head>
        {/* //TODO: Add custom title to each page, probably more link to a custom `Document` */}
        <title>Parallax</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <PostList posts={postListResult.data?.orgs?.lenses?.posts} />
      </main>
    </div>
  );
}
