import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';
import { useAuthActions } from 'state/auth';

const UserSettingsWrapper = styled.ul`
  width: 360px;
  background: var(--background);
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 0 8px;
  list-style: none;
`;

const UserInfo = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px;

  > img {
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
  color: var(--text);
`;

const UserNickname = styled.p`
  margin: 0;
  color: #666;
`;

const MenuItem = styled.li`
  border-bottom: 1px solid var(--accent2);
`;

const MenuAction = styled.a`
  display: block;
  color: var(--foreground);
  padding: 24px;

  &:hover {
    cursor: pointer;
    background-color: var(--highlight);
    color: white;
  }
`;

export default function UserSettings({
  profileImg,
  displayName,
  userHandle,
  ...props
}) {
  const { userLogout } = useAuthActions();

  const handleLogout = () => {
    userLogout();
  };

  return (
    <UserSettingsWrapper>
      <MenuItem>
        <UserInfo>
          <UserIcon src={profileImg} alt={`${displayName}'s avatar`} />
          <UserNameContainer>
            <UserName>{displayName}</UserName>
            <UserNickname>@{userHandle}</UserNickname>
          </UserNameContainer>
        </UserInfo>
      </MenuItem>
      <MenuItem>
        <MenuAction>Mood</MenuAction>
      </MenuItem>
      <MenuItem>
        <MenuAction type="button" onClick={handleLogout}>
          Log Out
        </MenuAction>
      </MenuItem>
    </UserSettingsWrapper>
  );
}
