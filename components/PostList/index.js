import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { media } from 'pageUtils/post/theme';
import { getLocaleDateTimeString } from 'utils/dateTime';

const Wrapper = styled.div`
  width: 800px;
  padding: 48px 16px;
  box-sizing: border-box;
  border-left: 1px solid var(--accent2);

  ${media.phone`
    width: 95%;
  `}
`;

const PostContainer = styled.div`
  &.empty {
    @keyframes loadingAnimation {
      0% {
        opacity: 0.5;
      }
      50% {
        opacity: 0.25;
      }
      100% {
        opacity: 0.5;
      }
    }
    animation: loadingAnimation 3s infinite;
  }
`;

const Post = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  margin: 0 0 30px 0;

  :hover:not(.loading) {
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
    border-radius: 50%;
    border: 8px solid var(--background);
    width: 8px;
    height: 8px;
    background-color: var(--accent);
    top: 20px;
    left: -28px;
    transition: background-color 150ms;
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

const MetaTag = styled.span`
  color: var(--link);

  &:hover {
    color: var(--highlight);
  }
`;

const PostTitle = styled.h2`
  margin: 0;
  font-weight: 700;
  color: var(--text);
  font-size: 32px;

  &:first-letter {
    text-transform: uppercase;
  }
`;

const PostSubTitle = styled.p`
  color: var(--text);
  margin: 0;
  font-size: 16px;

  &:first-letter {
    text-transform: uppercase;
  }
`;

const DemarcationString = styled.div`
  display: inline-block;
  position: relative;
  background-color: var(--background);
  padding: 8px 16px;
  width: 100px;
  margin-bottom: 2em;
  color: var(--accent);

  &:before {
    content: ' ';
    position: absolute;
    width: 10px;
    height: 2px;
    background-color: var(--accent2);
    left: -1em;
    top: 1.1em;
  }
`;

const EmptyDemarcationString = styled.div`
  display: inline-block;
  position: relative;
  width: 100px;
  padding: 8px 16px;
  margin-bottom: 2em;

  > div {
    color: var(--accent);
    background-color: var(--accent);
    width: 100%;
    border-radius: 8px;
  }

  &:before {
    content: ' ';
    position: absolute;
    width: 10px;
    height: 2px;
    background-color: var(--accent2);
    left: -1em;
    top: 1.1em;
  }
`;

const EmptyMeta = styled.div`
  border-radius: 8px;
  background-color: #666666;
  width: 78px;
  height: 15px;

  &.link {
    background-color: var(--link);
  }
`;

const EmptyPostTitle = styled.div`
  width: 75%;
  height: 39px;
  border-radius: 8px;
  background-color: #666666;
`;

const EmptySummary = styled.span`
  width: 75%;
  height: 20px;
  border-radius: 8px;
  background-color: #666666;
`;

export default function PostList({ posts = [], handleTagClick }) {
  let lastDate = null;
  const router = useRouter();

  const handlePostClick = postId => {
    router.push(`/post/${postId}`);
  };

  const enumMonth = Object.freeze({
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  });

  // TODO: rename timeUTC param name, it's not UTC time after converting by getLocaleDateTimeString util func
  const getTimeDemarcatorString = timeUTC => {
    const postDate = new Date(`${timeUTC}`);
    let demarcationString = '';

    if (lastDate && lastDate.getFullYear() !== postDate.getFullYear()) {
      // print year
      demarcationString = postDate.getFullYear().toString();
    } else if (lastDate && lastDate.getMonth() !== postDate.getMonth()) {
      // print month
      demarcationString = enumMonth[postDate.getMonth()];
    } else if (!lastDate) {
      // print first appropriate demarcator
      const latestDate = new Date();
      if (latestDate.getFullYear() !== postDate.getFullYear()) {
        demarcationString = postDate.getFullYear().toString();
      } else {
        demarcationString = enumMonth[postDate.getMonth()];
      }
    }

    lastDate = postDate;
    return demarcationString;
  };

  const generateEmptyPost = index => {
    return (
      <PostContainer key={`empty-${index}`} className="empty">
        {index === 0 && (
          <EmptyDemarcationString>
            <div>Loading</div>
          </EmptyDemarcationString>
        )}
        <Post className="loading">
          <PostWrapper>
            <PostInfo>
              <MetaInformation>
                <MetaDate>
                  <EmptyMeta />
                </MetaDate>
                <span>&nbsp; &middot; &nbsp;</span>
                <span>
                  <EmptyMeta className="link" />
                </span>
                <span>&nbsp; &middot; &nbsp;</span>
                <span>
                  <EmptyMeta />
                </span>
              </MetaInformation>
              <PostTitle>
                <EmptyPostTitle></EmptyPostTitle>
              </PostTitle>
              <PostSubTitle>
                <EmptySummary></EmptySummary>
              </PostSubTitle>
            </PostInfo>
          </PostWrapper>
        </Post>
      </PostContainer>
    );
  };

  return (
    <Wrapper>
      {posts.map((post, index) => {
        if (!post) return generateEmptyPost(index);
        const { id, title, author, createdAt, summary, tag } = post;
        const demarcationString = getTimeDemarcatorString(
          getLocaleDateTimeString(createdAt).toUpperCase()
        );

        return (
          <PostContainer key={id}>
            {demarcationString && (
              <DemarcationString key={demarcationString}>
                {demarcationString}
              </DemarcationString>
            )}
            <Post
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
                    <MetaTag
                      onClick={e => {
                        handleTagClick(e, tag?.name);
                      }}
                    >
                      #{tag?.name}
                    </MetaTag>
                    <span>&nbsp; &middot; &nbsp;</span>
                    <span>{author?.displayName}</span>
                  </MetaInformation>
                  <PostTitle>{title}</PostTitle>
                  <PostSubTitle>{summary}</PostSubTitle>
                </PostInfo>
              </PostWrapper>
            </Post>
          </PostContainer>
        );
      })}
    </Wrapper>
  );
}
