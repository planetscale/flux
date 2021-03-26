import styled from '@emotion/styled';
import { ButtonWireframe } from 'components/Button';
import { media } from './theme';

const CommentList = styled.div`
  margin: 0;
  padding: 0;
  padding-top: 2em;
  list-style: none;

  &[class*='level'] {
    margin-left: 2em;
  }
`;

const CommentListItem = styled.div`
  margin: 0;

  &:not(:last-child) {
    margin-bottom: 4em;
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
  text-transform: capitalize;
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
  padding: 2em 0;

  ${ButtonWireframe} {
    margin: 32px 0 0 0;
  }
`;

const CommentWrapper = styled.div`
  border-radius: 8px;
`;

const CommentContent = styled.div`
  font-size: var(--fs-base);
  line-height: 1.5em;
  color: var(--text-primary);

  > * {
    margin: 0;
  }
`;

const Comment = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 1em;
  color: var(--text-primary);

  > *:not(:last-child) {
    margin-bottom: 1.5em;
  }

  &.level0 {
    border-left: 1px solid var(--gray-600);
  }

  &.level1 {
    border-left: 1px solid var(--gray-700);
  }

  &.level2 {
    border-left: 1px solid var(--gray-800);
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

const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: -4px;

  > * {
    margin-right: 0.5em;
  }
`;

const Reply = styled.div`
  margin: 0;
  margin-bottom: ${props => (props.subcomment ? '' : '42px')};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 2em;
  border: 1px solid var(--border-primary);
  border-radius: 6px;
`;

const ReplyActionBar = styled(ActionBar)`
  margin-left: unset;
  margin-top: 1em;
  padding-top: 1em;
`;

const Post = styled.div`
  position: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
  margin: -2em;
  padding: 2em;
  border-radius: 6px;
  box-shadow: var(--layer-shadow);
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
  CommentActionButtonGroup,
  InputWrapper,
};
