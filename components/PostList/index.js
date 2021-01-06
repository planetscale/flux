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
  > div:first-of-type {
    font-size: 24px;
    line-height: 25px;
    color: #000000;
    margin: 0 0 6px 0;
  }

  > div:nth-of-type(2) {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 15px;
    color: #000000;

    div {
      margin: 0 16px 0 0;
    }
  }
`;

const Stars = styled.div`
  display: flex;
  align-items: end;
  margin: 6px 0 0 0;

  img {
    margin: 0 0 0 8px;
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
        const { id, title, author, createdAt, replies, stars } = post;
        return (
          <Post
            key={id}
            onClick={() => {
              handlePostClick(id);
            }}
          >
            <PostInfo>
              <div>{title}</div>
              <div>
                <div>{author?.displayName}</div>
                <div>{getLocaleDateTimeString(createdAt)}</div>
                <div>|</div>
                <div>{`${replies?.length} Comments`}</div>
              </div>
            </PostInfo>
            <Stars>
              {stars?.length} <img src="/star.svg" alt="star" />
            </Stars>
          </Post>
        );
      })}
    </Wrapper>
  );
}
