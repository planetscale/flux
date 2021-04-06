import styled from '@emotion/styled';
import { getTheme, setTheme } from 'pageUtils/post/theme';
import { Settings, Moon, Sun } from '@styled-icons/remix-line';
import * as DropdownMenu from 'components/DropdownMenu';
import { useImmer } from 'use-immer';
import { signOut } from 'next-auth/client';
import { ButtonImage } from 'components/Button';

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
  font-size: var(--fs-base);
  color: var(--text-primary);
`;

const UserNickname = styled.div`
  font-size: var(--fs-base-minus-1);
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
    background-color: var(--bg-secondary);
  }
`;

const StyledRadioGroup = styled(DropdownMenu.RadioGroup)`
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  box-shadow: var(--layer-shadow);

  *:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  *:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const StyledRadio = styled(DropdownMenu.RadioItem)`
  appearance: none;
  border: none;
  padding: 8px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  outline: 0;
  color: var(--text-primary);

  svg {
    width: 1em;
    height: 1em;
    transition: transform 250ms ease;
  }

  & ~ & {
    border-left: 1px solid var(--border-primary);
  }

  &:hover {
    background-color: var(--bg-secondary);

    svg {
      transform: translateY(-5%);
    }
  }
`;

const StyledIndicator = styled(DropdownMenu.ItemIndicator)`
  position: absolute;
  width: 100%;
  height: 100%;

  & + svg {
    color: var(--text-blue);
  }
`;

export default function UserSettings({ profileImg, displayName, userHandle }) {
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
    <DropdownMenu.Root>
      <ButtonImage as={DropdownMenu.Trigger} img={profileImg}></ButtonImage>
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
            <div>Theme</div>
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
                <Sun />
              </StyledRadio>
              <StyledRadio value="dark" onSelect={handleRadioItem}>
                <StyledIndicator />
                <Moon />
              </StyledRadio>
            </StyledRadioGroup>
          </MenuItem>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <DropdownMenu.SimpleItemWrapper>
            <MenuAction type="button" as="a" onClick={handleLogout}>
              Log Out
            </MenuAction>
          </DropdownMenu.SimpleItemWrapper>
        </DropdownMenu.Group>
      </UserSettingsWrapper>
    </DropdownMenu.Root>
  );
}
