import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';
import Logout from './Logout';

const UserSettingsWrapper = styled.div`
  width: 360px;
  background: var(--background);
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;

  > ${UserIcon} {
    width: 42px;
    height: 42px;
    margin-right: 16px;
  }
`;

const UserNameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.p`
  margin: 0;
  font-size: 24px;
`;

const UserNickname = styled.p`
  margin: 0;
  color: #666;
`;

export default function UserSettings({
  profileImg,
  displayName,
  userHandle,
  ...props
}) {
  return (
    <UserSettingsWrapper>
      <UserInfo>
        <UserIcon src={profileImg} alt={`${displayName}'s avatar`} />
        <UserNameContainer>
          <UserName>{displayName}</UserName>
          <UserNickname>@{userHandle}</UserNickname>
        </UserNameContainer>
      </UserInfo>
      <Logout />
    </UserSettingsWrapper>
  );
}
