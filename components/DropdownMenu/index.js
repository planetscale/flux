import styled from '@emotion/styled';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Content = styled(DropdownMenu.Content)`
  background: var(--accent3);
  color: var(--text);
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  padding: 0 0 8px;
`;

const SimpleItem = styled.div`
  padding: 24px;
`;

const Group = styled(DropdownMenu.Group)`
  border-bottom: 1px solid var(--accent2);
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