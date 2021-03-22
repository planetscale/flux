import styled from '@emotion/styled';
import { getTheme, setTheme } from 'pageUtils/post/theme';
import { Settings, Moon, Sun } from '@styled-icons/remix-line';
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
`;

const UserNameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: 20px;
  color: var(--text-primary);
`;

const UserNickname = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`;

const MenuItem = styled(DropdownMenu.SimpleItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--text-primary);
`;

const MenuAction = styled(DropdownMenu.SimpleItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--text-primary);

  &:hover {
    cursor: pointer;
    background-color: var(--bg-tertiary);
  }
`;

const StyledRadioGroup = styled(DropdownMenu.RadioGroup)`
  border: 1px solid var(--border-primary);
`;

const StyledRadio = styled(DropdownMenu.RadioItem)`
  appearance: none;
  background-color: var(--border-secondary);
  border: none;
  padding: 8px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  outline: 0;
  color: var(--text-primary);

  & ~ & {
    border-left: 1px solid var(--border-primary);
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
              <Settings />
            </StyledRadio>
            <StyledRadio value="light" onSelect={handleRadioItem}>
              <StyledIndicator />
              <Moon />
            </StyledRadio>
            <StyledRadio value="dark" onSelect={handleRadioItem}>
              <StyledIndicator />
              <Sun />
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
