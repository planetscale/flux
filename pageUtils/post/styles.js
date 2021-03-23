import styled from '@emotion/styled';
import { ButtonWireframe } from 'components/Button';
import { media } from './theme';

const CommentList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const PageWrapper = styled.div`
  padding: 5em 0;
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
`;

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
  /* border-bottom: 1px solid var(--border-primary); */
  padding: 32px 0;

  ${ButtonWireframe} {
    margin: 32px 0 0 0;
  }
`;

const CommentListItem = styled.li`
  padding: 0px 24px;
`;

const CommentWrapper = styled.div`
  border-radius: 8px;
  &:hover {
    background-color: var(--border-primary);

    .actions {
      opacity: 1;
    }
  }
  padding: 24px;
`;

const Comment = styled.div`
  position: relative;
  padding: 0 24px;
  color: var(--text-primary);

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

const CommentContent = styled.div`
  margin: 16px 0 0;
  font-size: var(--fs-base);
  color: var(--text-primary);
  line-height: 22px;
`;

const Post = styled.div`
  position: flex;
  flex-direction: column;
`;

const ActionBar = styled.div`
  padding: 16px 0 ${props => (props.comment ? '0' : '16px')};
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
