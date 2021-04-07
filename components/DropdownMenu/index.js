import styled from '@emotion/styled';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Content = styled(DropdownMenu.Content)`
  width: 420px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  box-shadow: var(--layer-shadow);
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: auto;
`;

const Label = styled(DropdownMenu.Label)`
  position: sticky;
  top: 0;
  padding: 3em 1.25em 1em;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  font-size: var(--fs-base-minus-2);
  color: var(--text-secondary);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

const PassiveItem = styled(DropdownMenu.Item)`
  padding: 1.5em 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--text-primary);

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-primary);
  }

  &:hover,
  &:active {
    outline: unset;
  }
`;

const ActiveItem = styled(DropdownMenu.Item)`
  padding: 1.5em 1em;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-primary);
  }

  &:hover {
    outline: unset;
    cursor: pointer;
    background-color: var(--bg-secondary);
  }
`;

const Group = styled(DropdownMenu.Group)`
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-primary);
  }
`;

const {
  Root,
  Trigger,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Item,
} = DropdownMenu;

export {
  Content,
  Group,
  Root,
  Trigger,
  Item,
  Label,
  PassiveItem,
  ActiveItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
};
