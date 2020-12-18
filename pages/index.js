import Head from 'next/head';
import PostList from 'components/PostList';
import { useQuery } from 'urql';

// TODO: only get current org's data
const postListQuery = `
  query {
    orgs {
      lenses {
        posts {
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
  console.log('index page');

  const [postListResult, runPostListQuery] = useQuery({
    query: postListQuery,
  });

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
