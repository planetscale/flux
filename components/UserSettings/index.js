import styled from '@emotion/styled';
import { getTheme, setTheme } from 'pageUtils/post/theme';
import { Settings, Moon, Sun } from '@styled-icons/remix-line';
import * as DropdownMenu from 'components/DropdownMenu';
import { useImmer } from 'use-immer';
import { signOut } from 'next-auth/client';
import { ButtonImage } from 'components/Button';

const UserInfo = styled(DropdownMenu.PassiveItem)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.div`
  font-size: var(--fs-base);
  color: var(--text-primary);
`;

const UserNickname = styled.div`
  font-size: var(--fs-base-minus-1);
  color: var(--text-secondary);
`;

const MenuAction = styled(DropdownMenu.ActiveItem)`
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

const StyledRadio = styled(DropdownMenu.RadioGroup)`
  border: 1px solid var(--border-primary);
  border-radius: 6px;

  *:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  *:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const StyledRadioItem = styled(DropdownMenu.RadioItem)`
  appearance: none;
  background-color: unset;
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
    console.log('logging out');
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
    event.stopPropagation();
  };

  return (
    <DropdownMenu.Root>
      <ButtonImage as={DropdownMenu.Trigger} img={profileImg}></ButtonImage>
      <DropdownMenu.Content sideOffset={42}>
        <UserInfo>
          <UserName>{displayName}</UserName>
          <UserNickname>@{userHandle}</UserNickname>
        </UserInfo>
        <DropdownMenu.PassiveItem>
          <div>Theme</div>
          <StyledRadio
            value={state.currentTheme}
            onValueChange={handleThemeChange}
          >
            <StyledRadioItem value="system" onCheckedChange={handleRadioItem}>
              <StyledIndicator />
              <Settings />
            </StyledRadioItem>
            <StyledRadioItem value="light" onCheckedChange={handleRadioItem}>
              <StyledIndicator />
              <Sun />
            </StyledRadioItem>
            <StyledRadioItem value="dark" onCheckedChange={handleRadioItem}>
              <StyledIndicator />
              <Moon />
            </StyledRadioItem>
          </StyledRadio>
        </DropdownMenu.PassiveItem>
        <MenuAction type="button" as="a" onSelect={handleLogout}>
          Log Out
        </MenuAction>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
