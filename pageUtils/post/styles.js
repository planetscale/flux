import styled from '@emotion/styled';

const PageWrapper = styled.div`
  padding: 42px;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PostMetadata = styled.div`
  padding: 0 0 32px 0;
  border-bottom: 1px solid #eee;
`;

const DateTime = styled.div`
  height: 19px;
  font-size: 16px;
  line-height: 19px;
`;

const Title = styled.div`
  color: var(--text);
  margin: 8px 0 24px 0;
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;
`;

const Content = styled.div`
  color: var(--text);
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0.02em;
  border-bottom: 1px solid #f7f7f7;
  padding: 32px 0;
`;

const Comment = styled.div`
  width: 90ch;
  padding: 0 0 30px 0;
  border-bottom: 1px solid #eeeeee;
  color: var(--text);
  margin: 42px 0 0 0;
`;

const Reply = styled.div`
  margin: 42px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 90ch;

  textarea {
    resize: none;
    height: 100px;
    width: 100%;
    border-radius: 8px;
    padding: 24px;
    align-self: stretch;
    margin-bottom: 24px;
    border: 1px solid #ccc;
    color: var(--text);

    :focus {
      outline: none;
    }
  }
`;

const CommentContent = styled.div`
  margin: 16px 0;
  height: 22px;
  font-size: 18px;
  color: var(--text);
  line-height: 22px;
`;

const Post = styled.div`
  width: 90ch;
`;

const ActionBar = styled.div`
  border-bottom: 1px solid #f7f7f7;
  padding: 16px 0;
`;

export {
  PageWrapper,
  Content,
  Comment,
  Reply,
  PostMetadata,
  DateTime,
  Title,
  CommentContent,
  Post,
  ActionBar,
};
