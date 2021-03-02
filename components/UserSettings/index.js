import styled from '@emotion/styled';
import { getTheme, setTheme } from 'pageUtils/post/theme';
import { Icon } from 'pageUtils/post/atoms';
import * as DropdownMenu from 'components/DropdownMenu';
import { useImmer } from 'use-immer';
import { signOut } from 'next-auth/client';

const UserSettingsWrapper = styled(DropdownMenu.Content)`
  width: 360px;
`;

const UserInfo = styled(DropdownMenu.SimpleItem)`
  display: flex;
  flex-direction: row;
  align-items: center;

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

const MenuItem = styled(DropdownMenu.SimpleItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--foreground);
`;

const MenuAction = styled(DropdownMenu.SimpleItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--foreground);

  &:hover {
    cursor: pointer;
    background-color: var(--accent2);
  }
`;

const StyledRadioGroup = styled(DropdownMenu.RadioGroup)`
  border: 1px solid var(--accent3);
`;

const StyledRadio = styled(DropdownMenu.RadioItem)`
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

const StyledIndicator = styled(DropdownMenu.ItemIndicator)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--highlight);

  & ~ ${Icon} {
    background: white;
  }
`;

export default function UserSettings({
  displayName,
  userHandle,
  currentTheme,
}) {
  const [state, setState] = useImmer({
    currentTheme: getTheme(),
  });

  const handleLogout = () => {
    signOut();
  };

  const handleThemeChange = value => {
    setTheme(value);
    setState(draft => {
      draft.currentTheme = value;
    });
  };

  const handleRadioItem = event => {
    event.preventDefault();
  };

  return (
    <UserSettingsWrapper sideOffset={42}>
      <DropdownMenu.Group>
        <UserInfo>
          <UserNameContainer>
            <UserName>{displayName}</UserName>
            <UserNickname>@{userHandle}</UserNickname>
          </UserNameContainer>
        </UserInfo>
      </DropdownMenu.Group>
      <DropdownMenu.Group>
        <MenuItem>
          <div>Mood</div>
          <StyledRadioGroup
            value={state.currentTheme}
            onValueChange={handleThemeChange}
          >
            <StyledRadio value="system" onSelect={handleRadioItem}>
              <StyledIndicator />
              <Icon className="icon-system"></Icon>
            </StyledRadio>
            <StyledRadio value="light" onSelect={handleRadioItem}>
              <StyledIndicator />
              <Icon className="icon-light"></Icon>
            </StyledRadio>
            <StyledRadio value="dark" onSelect={handleRadioItem}>
              <StyledIndicator />
              <Icon className="icon-dark"></Icon>
            </StyledRadio>
          </StyledRadioGroup>
        </MenuItem>
      </DropdownMenu.Group>
      <DropdownMenu.Group>
        <MenuAction type="button" as="a" onClick={handleLogout}>
          Log Out
        </MenuAction>
      </DropdownMenu.Group>
    </UserSettingsWrapper>
  );
}
