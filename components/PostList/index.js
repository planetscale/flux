import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { media } from 'pageUtils/post/theme';
import { getLocaleDateTimeString } from 'utils/dateTime';

const Wrapper = styled.div`
  width: 80ch;
  padding: 48px 16px;
  box-sizing: border-box;
  border-left: 1px solid var(--accent2);

  ${media.phone`
    width: 95%;
  `}
`;

const Post = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  margin: 0 0 30px 0;

  :hover {
    cursor: pointer;

    > div {
      background-color: var(--accent2);
    }

    &:before {
      background-color: var(--highlight);
      transform: scale(1.2);
    }
  }

  :active {
    > div {
      transform: scale(0.99);
    }

    &:before {
      transform: scale(1.4);
    }
  }

  :before {
    content: ' ';
    display: block;
    position: absolute;
    border-radius: 99px;
    border: 8px solid var(--background);
    width: 8px;
    height: 8px;
    background-color: var(--accent);
    top: 20px;
    left: -28px;
    transition: all 150ms;
  }
`;

const PostWrapper = styled.div`
  padding: 24px 16px;
  border-radius: 8px;
  transition: all 350ms;
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

const MetaDate = styled.span`
  white-space: nowrap;
`;

const PostTitle = styled.h2`
  margin: 0;
  font-weight: 700;
  color: var(--text);
  font-size: 32px;
`;

const PostSubTitle = styled.p`
  color: var(--text);
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
        if (!post) return;
        const { id, title, author, createdAt, summary } = post;
        return (
          <Post
            key={id}
            onClick={() => {
              handlePostClick(id);
            }}
          >
            <PostWrapper>
              <PostInfo>
                <MetaInformation>
                  <MetaDate>
                    {getLocaleDateTimeString(createdAt).toUpperCase()}
                  </MetaDate>
                  <span>&nbsp; &middot; &nbsp;</span>
                  <span>{author?.displayName}</span>
                </MetaInformation>
                <PostTitle>{title}</PostTitle>
                <PostSubTitle>{summary}</PostSubTitle>
              </PostInfo>
            </PostWrapper>
          </Post>
        );
      })}
    </Wrapper>
  );
}
