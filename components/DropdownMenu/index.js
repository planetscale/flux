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
  padding: 0 0 8px;
`;

const SimpleItem = styled.div`
  padding: 24px;
`;

const Group = styled(DropdownMenu.Group)`
  border-bottom: 1px solid var(--border-primary);
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
  SimpleItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
};
