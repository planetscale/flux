import styled from '@emotion/styled';
import { ButtonBase } from 'components/Button';

const Wrapper = styled.div`
  padding: 60px 68px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
`;

const BodyWrapper = styled.div`
  padding: 0 0 0 60px;
  border-left: 1px solid #000000;
`;

const Post = styled.div`
  :not(:last-of-type) {
    margin: 0 0 72px 0;
  }

  :last-of-type {
    padding: 0 0 36px 0;
  }
`;

const Content = styled.div`
  font-family: monospace;
  font-size: 16px;
  line-height: 24px;
`;

const Comment = styled.div`
  padding: 0 0 36px 0;

  > div:last-of-type {
    font-size: 14px;
    line-height: 15px;
    opacity: 0.5;
    margin: 6px 0 0 0;
  }
`;

const UserIconWrapper = styled.div`
  padding: 12px;
  background-color: #ffffff;
  position: relative;
  float: left;
  overflow-y: hidden;
  margin: 0 -86px 0 0; // user icon offsets
  transform: translate(-104px, -18px);
`;

const Reply = styled.div`
  padding: 0 0 86px 60px;

  textarea {
    resize: none;
    height: 125px;
    min-width: 495px;
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

export { Wrapper, BodyWrapper, Post, Content, Comment, UserIconWrapper, Reply };
