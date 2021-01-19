import styled from '@emotion/styled';
import { ButtonMinor } from 'components/Button';
import { media } from './theme';

const PageWrapper = styled.div`
  padding: 42px;
  width: 80ch;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${media.phone`
    width: 100%;
  `}
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

const Title = styled.div`
  color: var(--text);
  margin: 8px 0 24px 0;
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;

  &:first-letter {
    text-transform: uppercase;
  }
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

const CommentList = styled.ul`
  padding: 24px 0;
  margin: 0;
  list-style: none;
`;

const CommentListItem = styled.li`
  padding: 24px;
  margin: 0 -24px;
  border-radius: 8px;

  &:hover {
    background-color: var(--accent2);

    .actions {
      opacity: 1;
    }
  }

  &.leveltwo {
    margin: 0;
  }

  &.levelthree {
    margin: 0 24px;
  }
`;

const Comment = styled.div`
  position: relative;
  padding: 0 24px;
  color: var(--text);

  &.levelone {
    border-left: 2px solid #9096ad;
  }

  &.leveltwo {
    border-left: 2px solid #fccada;
  }

  &.levelthree {
    border-left: 2px solid #d3f1d6;
  }
`;

const Reply = styled.div`
  margin: 42px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  textarea {
    resize: none;
    height: 100px;
    width: 100%;
    border-radius: 8px;
    padding: 24px;
    align-self: stretch;
    margin-bottom: 24px;
    border: 1px solid var(--accent);
    background-color: var(--background);
    color: var(--text);

    :focus {
      outline: none;
    }
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
