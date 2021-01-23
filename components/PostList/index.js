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

const PostContainer = styled.div``;

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

  return (
    <Wrapper>
      {posts.map(post => {
        if (!post) return;
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
