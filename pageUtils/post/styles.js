import styled from '@emotion/styled';
import { ButtonBase } from 'components/Button';

const PageWrapper = styled.div`
  padding: 42px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PostMetadata = styled.div`
  padding: 0 0 32px 0;
  border-bottom: 1px solid #e1e1e1;
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
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.02em;
  margin: 32px 0 0 0;
  padding: 0 0 32px 0;
  border-bottom: 1px solid #eeeeee;
`;

const Comment = styled.div`
  padding: 0 0 30px 0;
  border-bottom: 1px solid #eeeeee;
  margin: 42px 0 0 0;

  > div:last-of-type {
    font-size: 14px;
    line-height: 15px;
    opacity: 0.5;
    margin: 6px 0 0 0;
  }
`;

const Reply = styled.div`
  margin: 76px 42px 0;

  textarea {
    resize: none;
    height: 205px;
    max-width: 747px;
    min-width: 495px;
    border-radius: 8px;

    :focus {
      outline: none;
    }
  }

  ${ButtonBase} {
    border: 1px solid #423f3f;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 5px 18px;
    font-weight: 500;
    font-size: 16px;
    line-height: 18px;
  }
`;

const CommentContent = styled.div`
  margin: 16px 0;
  height: 22px;
  font-size: 18px;
  line-height: 22px;
`;

const Post = styled.div`
  padding: 0 42px;
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
