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

export default function Home({ href, ...props }) {
  const [postListResult, runPostListQuery] = useQuery({
    query: postListQuery,
  });
  const { setHeaders } = useTopBarActions();
  const { user } = useUserContext();

  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
        subHeader: '',
      });
    }
  }, [user?.org]);

  return (
    <div>
      <Head>
        {/* //TODO: Add custom title to each page, probably more link to a custom `Document` */}
        <title>Parallax</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <PostList posts={postListResult.data?.orgs?.[0].lenses?.[0].posts} />
      </main>
    </div>
  );
}
