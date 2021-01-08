import styled from '@emotion/styled';
import { ButtonBase } from 'components/Button';

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
  height: 58px;
  margin: 8px 0 24px 0;
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;
`;

const Content = styled.div`
  color: var(--text);
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.02em;
  margin: 32px 0 0 0;
  padding: 0 0 32px 0;
  border-bottom: 1px solid #eeeeee;
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

    :focus {
      outline: none;
    }
  }
`;

const CommentContent = styled.div`
  margin: 16px 0;
  height: 22px;
  font-size: 18px;
  line-height: 22px;
`;

const Post = styled.div`
  width: 90ch;
  margin-bottom: 60px;
`;

const StarBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  width: 78px;
  height: 34px;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  border-radius: 99px;

  img {
    width: 16px;
    height: auto;
  }

  div {
    font-size: 14px;
    line-height: 18px;
  }
  :hover {
    cursor: pointer;
  }
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
  StarBox,
};
