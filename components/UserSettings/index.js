import styled from '@emotion/styled';
import { useAuthActions } from 'state/auth';
import { getTheme, setTheme } from 'pageUtils/post/theme';
import { Icon } from 'pageUtils/post/atoms';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const UserSettingsWrapper = styled(DropdownMenu.Content)`
  width: 360px;
  background: var(--accent3);
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  padding: 0 0 8px;
`;

const UserInfo = styled.div`
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

const MenuItemContainer = styled(DropdownMenu.Group)`
  border-bottom: 1px solid var(--accent2);
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--foreground);
  padding: 24px;
`;

const MenuAction = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--foreground);
  padding: 24px;

  &:hover {
    cursor: pointer;
    background-color: var(--highlight);
    color: white;
  }
`;

const StyledRadioGroup = styled(RadioGroup.Root)`
  border: 1px solid var(--accent3);
`;

const StyledRadio = styled(RadioGroup.Item)`
  appearance: none;
  background-color: var(--accent2);
  border: none;
  padding: 8px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  outline: 0;

  & ~ & {
    border-left: 1px solid var(--accent3);
  }

  &:focus {
    outline: 'none';
    box-shadow: 'inset 0 0 0 1px dodgerblue, 0 0 0 1px dodgerblue';
  }
`;

const StyledIndicator = styled(RadioGroup.Indicator)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #c56a86;

  & ~ ${Icon} {
    background: white;
  }
`;

export default function UserSettings({
  profileImg,
  displayName,
  userHandle,
  ...props
}) {
  const { userLogout } = useAuthActions();
  const currentTheme = getTheme();

  const handleLogout = () => {
    userLogout();
  };

  const handleThemeChange = value => {
    setTheme(value.target.value);
  };

  return (
    <UserSettingsWrapper sideOffset={42}>
      <MenuItemContainer>
        <UserInfo>
          <UserNameContainer>
            <UserName>{displayName}</UserName>
            <UserNickname>@{userHandle}</UserNickname>
          </UserNameContainer>
        </UserInfo>
      </MenuItemContainer>
      <MenuItemContainer>
        <MenuItem>
          <div>Mood</div>
          <StyledRadioGroup
            defaultValue={currentTheme}
            onValueChange={handleThemeChange}
          >
            <StyledRadio value="system">
              <StyledIndicator />
              <Icon className="icon-system"></Icon>
            </StyledRadio>
            <StyledRadio value="light">
              <StyledIndicator />
              <Icon className="icon-light"></Icon>
            </StyledRadio>
            <StyledRadio value="dark">
              <StyledIndicator />
              <Icon className="icon-dark"></Icon>
            </StyledRadio>
          </StyledRadioGroup>
        </MenuItem>
      </MenuItemContainer>
      <MenuItemContainer>
        <MenuAction type="button" onClick={handleLogout}>
          Log Out
        </MenuAction>
      </MenuItemContainer>
    </UserSettingsWrapper>
  );
}
