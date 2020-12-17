import styled from '@emotion/styled';

const Wrapper = styled.div`
  width: 100%;
  height: 138px;
  padding: 52px 48px;
`;

const Post = styled.div`
  width: 452px;
  display: flex;
  justify-content: space-between;

  &:not(:last-of-type) {
    margin: 0 0 16px 0;
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

export default function PostList({
  posts = [
    {
      name: 'User research on cloud spend',
      author: {
        displayName: 'Abhi Vaidyanatha',
      },
      createdAt: '3 hours ago',
      replies: [
        {
          id: 1,
        },
      ],
    },
    {
      name: 'User research on cloud spend',
      author: {
        displayName: 'Abhi Vaidyanatha',
      },
      createdAt: '4 hours ago',
      replies: [
        {
          id: 1,
        },
      ],
    },
  ],
}) {
  return (
    <Wrapper>
      {posts.map(post => {
        const { name, author, createdAt, replies, stars } = post;
        return (
          <Post key={createdAt}>
            <PostInfo>
              <div>{name}</div>
              <div>
                <div>{author?.displayName}</div>
                <div>{createdAt}</div>
                <div>|</div>
                <div>{`${replies?.length} Comments`}</div>
              </div>
            </PostInfo>
            {stars && (
              <Stars>
                {stars?.length} <img src="star.svg" alt="next" />
              </Stars>
            )}
          </Post>
        );
      })}
    </Wrapper>
  );
}
