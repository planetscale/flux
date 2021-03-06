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
  transition: all 250ms ease;

  svg {
    width: 1em;
    height: 1em;
  }

  span:nth-of-type(1) {
    margin-left: 8px;
  }

  &:hover:not([disabled]) {
    cursor: pointer;
  }

  &:focus {
    outline-width: 1px;
  }

  &:disabled {
    opacity: 0.42;
  }
`;

export const ButtonWireframe = styled(ButtonBase)`
  background-color: var(--bg-primary);
  border: 1px solid var(--border-secondary);

  &:hover:not([disabled]) {
    background-color: var(--bg-secondary);
    border: 1px solid var(--text-blue);
  }

  &.has-notifications {
    background-color: #02361b;
    border-color: #02361b;
    color: rgb(var(--green-600));
  }

  &.primary {
    background-color: var(--text-primary);
    border-color: var(--text-primary);
    color: var(--bg-secondary);

    &:hover:not([disabled]) {
      background-color: var(--text-blue);
      color: var(--white);
    }
  }

  &.with-shortcut {
    span:nth-of-type(2) {
      border-left: 1px solid var(--bg-secondary);
      margin-left: 8px;
      padding-left: 8px;
      transition: border-color 250ms ease;
    }

    &:hover:not([disabled]) {
      span:nth-of-type(2) {
        border-color: var(--border-primary);
      }
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
    background-color: var(--bg-tertiary);
    border: 1px solid var(--text-blue);
  }

  &.selected {
    background-color: rgba(0, 146, 251, 0.39);
    border-color: rgba(var(--blue-500), 0.1);
    color: rgb(var(--blue-500));
  }
`;

export const ButtonImage = styled(ButtonBase)`
  padding: 0;
  width: 36px;
  height: 36px;
  background: url(${props => props.img || '/user_profile_icon.svg'});
  background-repeat: no-repeat;
  background-size: contain;
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
