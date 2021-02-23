import styled from '@emotion/styled';
import { ButtonMinor } from 'components/Button';
import { media } from './theme';

const CommentList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const PageWrapper = styled.div`
  padding: 42px 0;
  width: 80ch;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  ${media.phone`
    padding: 42px;
    width: 100%;
  `}

  > ${CommentList} {
    margin: 0 0 0 -48px;
    padding: 24px 0px;
  }
`;

const PostMetadata = styled.div`
  padding: 0 0 32px 0;
  border-bottom: 1px solid var(--accent2);
`;

const DateTime = styled.div`
  height: 19px;
  font-size: 16px;
  line-height: 19px;
  color: var(--text);
`;

const Title = styled.h1`
  color: var(--text);
  margin: 8px 0 24px 0;
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;

  &:first-letter {
    text-transform: uppercase;
  }

  ${media.phone`
    font-size: 32px;
    margin: 0.5em 0;
  `}
`;

const Content = styled.div`
  color: var(--text);
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0.02em;
  border-bottom: 1px solid var(--accent2);
  padding: 32px 0;

  ${ButtonMinor} {
    margin: 32px 0 0 0;
  }
`;

const CommentListItem = styled.li`
  padding: 0px 24px;
`;

const CommentWrapper = styled.div`
  border-radius: 8px;
  &:hover {
    background-color: var(--accent2);

    .actions {
      opacity: 1;
    }
  }
  padding: 24px;
`;

const Comment = styled.div`
  position: relative;
  padding: 0 24px;
  color: var(--text);

  &.level0 {
    border-left: 2px solid #9096ad;
  }

  &.level1 {
    border-left: 2px solid #fccada;
  }

  &.level2 {
    border-left: 2px solid #d3f1d6;
  }
`;

const Reply = styled.div`
  margin: 42px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em 0;
  border-top: 1px solid var(--accent2);

  ${ButtonMinor} {
    width: 105px;
    margin: 24px 0 0 0;
  }
`;

const CommentContent = styled.div`
  margin: 16px 0 0;
  font-size: 18px;
  color: var(--text);
  line-height: 22px;
`;

const Post = styled.div``;

const ActionBar = styled.div`
  border-bottom: 1px solid var(--accent2);
  padding: 16px 0;
`;

const CommenterNameplateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CommentActionButtonGroup = styled.div`
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;

  ${ButtonMinor}:nth-of-type(2) {
    margin: 0 0 0 8px;
  }
`;

export {
  PageWrapper,
  Content,
  CommentList,
  CommentListItem,
  CommentWrapper,
  Comment,
  Reply,
  PostMetadata,
  DateTime,
  Title,
  CommentContent,
  Post,
  ActionBar,
  CommenterNameplateWrapper,
  CommentActionButtonGroup,
};
