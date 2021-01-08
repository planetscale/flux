import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  > span:last-of-type {
    height: 17px;
    font-size: 14px;
    line-height: 17px;
    color: #666666;
    margin: 0 0 0 12px;
  }
`;

export default function CommenterNamePlate({
  displayName,
  userHandle,
  avatar,
  ...props
}) {
  return (
    <Wrapper>
      <UserIcon
        src={avatar || '/user_profile_icon.svg'}
        width="32px"
        height="32px"
        alt={`${displayName}'s profile picture`}
      />
      <span>{displayName} </span>
    </Wrapper>
  );
}
