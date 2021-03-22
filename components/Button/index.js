import styled from '@emotion/styled';
import { media } from '../../pageUtils/post/theme';
import { Icon } from 'pageUtils/post/atoms';

export const ButtonBase = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  color: var(--text-secondary);
  border: unset;
  font-size: 14px;
  height: 36px;

  svg {
    width: 1em;
    height: 1em;
  }

  span:nth-child(2) {
    margin-left: 8px;
  }

  ${Icon} {
    width: 20px;
    height: 20px;
    margin: 0 0.5em 0 0;
  }

  &:hover:not([disabled]) {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.42;
  }
`;

export const ButtonWireframe = styled(ButtonBase)`
  background-color: var(--bg-secondary);

  &:hover:not([disabled]) {
    background-color: var(--bg-tertiary);
  }

  &.selected {
    color: rgb(var(--blue-600));
    background-color: rgb(var(--blue-200));

    &:hover:not([disabled]) {
      background-color: var(--highlight);
    }
  }
`;

export const ButtonSquished = styled(ButtonWireframe)`
  padding: 4px 16px;
  font-size: 0.9em;
`;

export const ButtonImage = styled(ButtonBase)`
  border: 0;
  padding: 0;
  width: 36px;
  height: 36px;

  > img {
    width: 100%;
    height: auto;
  }

  ${media.phone`
    width: 32px;
    height: 32px;
  `}
`;

export const ButtonComposite = styled.a`
  display: flex;
  flex-direction: row;
  border-radius: 6px;

  &:hover:not([disabled]) {
    cursor: pointer;
  }
`;
