import styled from '@emotion/styled';
import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import UserIcon from 'components/UserIcon';

const Wrapper = styled.div`
  padding: 60px 68px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: scroll;
`;

const BodyWrapper = styled.div`
  padding: 0 0 0 60px;
  border-left: 1px solid #000000;
`;

const Post = styled.div`
  margin: 0 0 72px 0;
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
  width: 62px;
  height: 62px;
  padding: 12px;
  background-color: #ffffff;
  position: relative;
  float: left;
  overflow-y: hidden;
  margin: 0 -86px 0 0; // user icon offsets
  transform: translate(-104px, -20px);
`;

const Reply = styled.div`
  padding: 0 0 86px 60px;

  textarea {
    resize: none;
    height: 125px;
    min-width: 495px;
  }

  button {
    display: block;
  }
`;

export default function PostPage() {
  const post =
    'User research has shown that developers are three times as likely to use an application is there is a dark mode feature. Additionally, 73% of users use dark mode if the option is available to them. This has informed us to prioritize this feature. It is unclear what technology we need in order for this to become a reality, but we will be exploring different options to make sure that we pick the darkest mode possible. There are many approaches to choosing a dark mode palette and there are many different types of achromatic hues. For example, it is considered bad practice to use a color hex value that includes the letter G, as the Harvard Business Review indicates in this study. I hope you all will join me in this journey, as we are likely to triple our ARR if we can push this to production by Q2.';

  const comment =
    'I generally agree, but that HBR study looks a little suspicious. It says that they only surveyed developers, so where did that 73% statistic come from?';

  return (
    <Wrapper>
      <BodyWrapper>
        <Post>
          <UserIconWrapper>
            <UserIcon />
          </UserIconWrapper>
          <AuthorNamePlate />
          <Content>{post}</Content>
        </Post>
        <Comment>
          <UserIconWrapper>
            <UserIcon />
          </UserIconWrapper>
          <CommenterNamePlate />
          <Content>{comment}</Content>
          <div>{'4 minutes'} ago</div>
        </Comment>
      </BodyWrapper>
      <Reply>
        <UserIconWrapper>
          <UserIcon />
        </UserIconWrapper>
        <textarea></textarea>
        <button type="submit">Reply.</button>
      </Reply>
    </Wrapper>
  );
}
