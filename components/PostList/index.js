import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { getLocaleDateTimeString } from 'utils/dateTime';

const Wrapper = styled.div`
  width: 90ch;
  padding: 48px 16px;
  box-sizing: border-box;
  border-left: 1px solid #eee;
`;

const Post = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 16px;
  border-radius: 8px;
  margin: 0 0 30px 0;

  :hover {
    cursor: pointer;
    background-color: #f7f7f7;

    &:before {
      background-color: #c56a86;
    }
  }

  :before {
    content: ' ';
    display: block;
    position: absolute;
    border-radius: 99px;
    border: 8px solid white;
    width: 8px;
    height: 8px;
    background-color: #999;
    left: -28px;
  }
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;

  > :not(:last-child) {
    margin-bottom: 8px;
  }
`;

const MetaInformation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  line-height: 15px;
  color: #666666;
`;

const PostTitle = styled.h2`
  margin: 0;
  font-weight: bold;
  font-size: 32px;
`;

const PostSubTitle = styled.p`
  margin: 0;
  font-size: 16px;
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
              <MetaInformation>
                <div>{getLocaleDateTimeString(createdAt).toUpperCase()}</div>
                <div>&nbsp; &middot; &nbsp;</div>
                <div>{author?.displayName}</div>
              </MetaInformation>
              <PostTitle>{title}</PostTitle>
              <PostSubTitle>{summary}</PostSubTitle>
            </PostInfo>
          </Post>
        );
      })}
    </Wrapper>
  );
}
