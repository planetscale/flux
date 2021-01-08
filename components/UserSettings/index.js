import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';
import Logout from './Logout';

const Wrapper = styled.div`
  width: 360px;
  background: #ffffff;
  border: 2px solid #000000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;

  > div {
    margin: 12px 0 0 0;
  }

  > div:last-of-type {
    opacity: 0.5;
  }
`;

const SettingsUserIcon = styled(UserIcon)`
  width: 116px;
  height: 116px;
`;

export default function UserSettings({
  profileImg,
  displayName,
  userHandle,
  ...props
}) {
  return (
    <Wrapper>
      <UserInfo>
        <SettingsUserIcon src={profileImg} alt={`${displayName}'s avatar`} />
        <div>{displayName}</div>
        <div>@{userHandle}</div>
      </UserInfo>
      <Logout />
    </Wrapper>
  );
}
