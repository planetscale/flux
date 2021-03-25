import styled from '@emotion/styled';
import { media } from '../../pageUtils/post/theme';

export const ButtonBase = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  color: var(--text-secondary);
  border: unset;
  font-size: var(--fs-base-minus-1);
  height: 36px;

  svg {
    width: 1em;
    height: 1em;
  }

  span:nth-child(2) {
    margin-left: 8px;
  }

  &:hover:not([disabled]) {
    cursor: pointer;
    box-shadow: var(--layer-shadow);
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
    color: rgb(var(--white));
    background-color: rgb(var(--blue-500));

    &:hover:not([disabled]) {
      background-color: rgb(var(--blue-500));
    }
  }
`;

export const ButtonSquished = styled(ButtonBase)`
  height: 28px;
  padding: 8px 12px;
  font-size: var(--fs-base-minus-2);
  background-color: unset;
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);

  &:hover:not([disabled]) {
    background-color: var(--bg-secondary);
  }

  &.selected {
    background-color: rgba(var(--blue-500), 0.1);
    border-color: rgba(var(--blue-500), 0.1);
    color: rgb(var(--blue-500));
  }
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
  color: var(--text-primary);

  &:hover:not([disabled]) {
    cursor: pointer;
  }
`;
