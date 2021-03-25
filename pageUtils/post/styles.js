import styled from '@emotion/styled';
import { ButtonWireframe } from 'components/Button';
import { media } from './theme';

const CommentList = styled.ul`
  margin: 0;
  padding: 0;
  padding-top: 2em;
  list-style: none;

  &[class*='level'] {
    margin-left: 2em;
  }
`;

const PageWrapper = styled.div`
  padding: 4em 0 2em;
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

const PostMetadata = styled.div``;

const DateTime = styled.div`
  color: var(--text-secondary);
`;

const Title = styled.h1`
  color: var(--text-primary);
  margin: 8px 0 24px 0;
  font-weight: bold;
  font-size: var(--fs-base-plus-4);
  line-height: 58px;

  &:first-letter {
    text-transform: uppercase;
  }

  ${media.phone`
    font-size: var(--fs-base-plus-3);
    margin: 0.5em 0;
  `}
`;

const Content = styled.div`
  color: var(--text-primary);
  font-size: var(--fs-base);
  line-height: 28px;
  letter-spacing: 0.02em;
  padding: 1em 0 2em;

  ${ButtonWireframe} {
    margin: 32px 0 0 0;
  }
`;

const CommentListItem = styled.li`
  margin: 0 0 4em;
`;

const CommentWrapper = styled.div`
  border-radius: 8px;
`;

const CommentContent = styled.div`
  font-size: var(--fs-base-minus-1);
  color: var(--text-primary);
  margin: 1em 0 1.5em;

  > * {
    margin: 0;
  }
`;

const Comment = styled.div`
  position: relative;
  padding: 0 1em;
  color: var(--text-primary);

  &.level0 {
    border-left: 1px solid rgb(var(--blue-500), 0.42);
  }

  &.level1 {
    border-left: 1px solid rgba(var(--green-500), 0.42);
  }

  &.level2 {
    border-left: 1px solid rgba(var(--pink-500), 0.42);
  }
`;

const Reply = styled.div`
  margin: 0 0 42px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 2em;
  border: 1px solid var(--border-primary);
  border-radius: 6px;
`;

const ReplyActionBar = styled.div`
  width: 100%;
  margin-top: 1em;
  padding-top: 1em;
`;

const Post = styled.div`
  position: flex;
  flex-direction: column;
`;

const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: -4px;

  > * {
    margin-right: 0.5em;
  }
`;

const CommenterNameplateWrapper = styled.div`
  display: flex;
  flex-direction: row;

  > * {
    margin-right: 1em;
  }
`;

const CommentActionButtonGroup = styled.div`
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;

  ${ButtonWireframe}:nth-of-type(2) {
    margin-left: 8px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  margin-bottom: 1em;
  padding: 16px;
  border-radius: 6px;

  input {
    background-color: unset;
    color: var(--text-primary);
    border-bottom: 1px solid var(--bg-secondary);
  }

  &:hover {
    cursor: pointer;
    background-color: var(--bg-tertiary);

    input {
      border-color: var(--bg-tertiary);
      background-color: var(--bg-tertiary);
    }
  }

  &.disabled {
    cursor: default;
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);

    input {
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0);
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);

      input {
        background-color: rgba(255, 255, 255, 0);
      }
    }

    ${media.phone`
      border-radius: 0;
    `}
  }

  &.error {
    input {
      border-bottom: 1px solid var(--red-500);
    }
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
  ReplyActionBar,
  PostMetadata,
  DateTime,
  Title,
  CommentContent,
  Post,
  ActionBar,
  CommenterNameplateWrapper,
  CommentActionButtonGroup,
  InputWrapper,
};
