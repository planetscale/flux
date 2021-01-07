import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { getLocaleDateTimeString } from 'utils/dateTime';

const Wrapper = styled.div`
  width: 747px;
  padding: 52px 48px;
  box-sizing: border-box;
`;

const Post = styled.div`
  width: 452px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  :hover {
    > div > div:first-of-type {
      text-decoration: underline;
    }
  }

  &:not(:last-of-type) {
    margin: 0 0 24px 0;
  }
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    margin: 0 0 8px 0;
  }

  > div:first-of-type {
    display: flex;
    align-items: center;
    height: 15px;
    font-size: 12px;
    line-height: 15px;
    color: #666666;
  }

  > div:nth-of-type(2) {
    height: 39px;
    font-weight: bold;
    font-size: 32px;
    line-height: 39px;
  }

  > div:nth-of-type(3) {
    height: 19px;
    max-width: 747px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default function PostList({ posts = [] }) {
  const router = useRouter();
  const handlePostClick = postId => {
    router.push(`/post/${postId}`);
  };

  return (
    <Wrapper>
      {posts.map(post => {
        const { id, title, author, createdAt, summary } = post;
        return (
          <Post
            key={id}
            onClick={() => {
              handlePostClick(id);
            }}
          >
            <PostInfo>
              <div>
                <div>{getLocaleDateTimeString(createdAt).toUpperCase()}</div>
                <div>&nbsp; &middot; &nbsp;</div>
                <div>{author?.displayName}</div>
              </div>
              <div>{title}</div>
              {summary && <div>{summary}</div>}
            </PostInfo>
          </Post>
        );
      })}
    </Wrapper>
  );
}
