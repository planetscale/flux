import styled from '@emotion/styled';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Content = styled(DropdownMenu.Content)`
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  box-shadow: var(--layer-shadow);
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const SimpleItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1em;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-primary);
  }

  &:hover {
    cursor: pointer;
    background-color: var(--bg-secondary);
  }
`;

const SimpleItem = styled.div`
  padding: 1em;
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
  SimpleItemWrapper,
  SimpleItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
};
