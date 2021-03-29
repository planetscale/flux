import React from 'react';
import styled from '@emotion/styled';
import { media } from 'pageUtils/post/theme';
import { getLocaleDateTimeString } from 'utils/dateTime';
import Link from 'next/link';
import useSWR from 'swr';

const Wrapper = styled.div`
  width: 80ch;
  padding: 48px 16px;
  box-sizing: border-box;
  border-left: 1px solid var(--border-primary);

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

const Post = styled.a`
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--text-primary);

  > div {
    border: 1px solid var(--bg-primary);
    background-color: var(--bg-primary);
    transition: all 250ms ease;
  }

  margin: 0 0 30px 0;

  :hover:not(.loading) {
    cursor: pointer;

    > div {
      background-color: var(--bg-secondary);
      box-shadow: var(--layer-shadow);
      transform: translateY(-0.5%);
    }

    &:before {
      background-color: rgba(var(--blue-500), 1);
      transform: scale(1.2) translateY(-0.5%);
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
    border: 8px solid var(--bg-primary);
    width: 8px;
    height: 8px;
    background-color: var(--border-primary);
    top: 20px;
    left: -28px;
    transition: all 250ms ease;
  }

  &.new {
    &:before {
      background-color: rgb(var(--green-500));
    }
  }
`;

const PostWrapper = styled.div`
  padding: 24px 16px;
  border-radius: 8px;
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
  font-size: var(--fs-base-minus-2);
  color: var(--text-secondary);

  .notification {
    color: rgb(var(--green-400));
  }
`;

const MetaDate = styled.span`
  white-space: nowrap;
  text-transform: capitalize;
`;

const MetaTag = styled.span`
  color: var(--text-blue);
  &:hover {
    color: var(--highlight);
  }
`;

const PostTitle = styled.h2`
  margin: 0;
  color: var(--text-primary);
  font-size: var(--fs-base-plus-2);

  &:first-letter {
    text-transform: uppercase;
  }
`;

const PostSubTitle = styled.p`
  color: var(--text-primary);
  margin: 0;
  font-size: var(--fs-base);

  &:first-letter {
    text-transform: uppercase;
  }
`;

const DemarcationString = styled.div`
  display: inline-block;
  position: relative;
  padding: 8px 16px;
  width: 100px;
  margin-bottom: 2em;
  font-size: var(--fs-base-minus-1);
  color: var(--text-secondary);

  &:before {
    content: ' ';
    position: absolute;
    width: 10px;
    height: 1px;
    background-color: var(--border-primary);
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
    color: var(--text-secondary);
    background-color: var(--text-secondary);
    width: 100%;
    border-radius: 8px;
  }

  &:before {
    content: ' ';
    position: absolute;
    width: 10px;
    height: 2px;
    background-color: var(--border-primary);
    left: -1em;
    top: 1.1em;
  }
`;

const EmptyMeta = styled.div`
  border-radius: 8px;
  background-color: var(--bg-secondary);
  width: 78px;
  height: 15px;

  &.link {
    background-color: var(--text-blue);
  }
`;

const EmptyPostTitle = styled.div`
  width: 75%;
  height: 39px;
  border-radius: 8px;
  background-color: var(--bg-secondary);
`;

const EmptySummary = styled.span`
  display: inherit;
  margin: 0px;
  width: 75%;
  height: 20px;
  border-radius: 8px;
  background-color: var(--bg-secondary);
`;

export default function PostList({ posts = [], handleTagClick }) {
  let lastDate = null;

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

  const { data: notifications } = useSWR(['/api/get-notifications'], url =>
    fetcher('GET', url)
  );
  let notificationLookup = {};
  if (notifications) {
    notificationLookup = notifications.reduce((accumulator, current) => {
      accumulator[current.postId] = current;
      return accumulator;
    }, {});
  }

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

  const handleClick = (e, tagName) => {
    if (e.target.className.includes('MetaTag')) {
      e.preventDefault();
      handleTagClick(e, tagName);
    }
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
            <Link href={`/post/${id}`} passHref>
              <Post
                onClick={e => handleClick(e, tag?.name)}
                className={
                  notificationLookup[id] && notificationLookup[id].isNewPost
                    ? 'new'
                    : ''
                }
              >
                <PostWrapper>
                  <PostInfo>
                    <MetaInformation>
                      <MetaDate>{getLocaleDateTimeString(createdAt)}</MetaDate>
                      {tag?.name && (
                        <>
                          <span>&nbsp; &middot; &nbsp;</span>
                          <MetaTag>#{tag?.name}</MetaTag>
                        </>
                      )}
                      <span>&nbsp; &middot; &nbsp;</span>
                      <span>{author?.displayName}</span>
                      {notificationLookup[id] &&
                      notificationLookup[id].numNewReplies ? (
                        <React.Fragment>
                          <span>&nbsp; &middot; &nbsp;</span>
                          <div className="notification">
                            {notificationLookup[id].numNewReplies > 1
                              ? 'New Comments'
                              : 'New Comment'}
                          </div>
                        </React.Fragment>
                      ) : (
                        ''
                      )}
                    </MetaInformation>
                    <PostTitle>{title}</PostTitle>
                    <PostSubTitle>{summary}</PostSubTitle>
                  </PostInfo>
                </PostWrapper>
              </Post>
            </Link>
          </PostContainer>
        );
      })}
    </Wrapper>
  );
}
