import styled from '@emotion/styled';
import { Icon } from 'pageUtils/post/atoms';

export const ButtonBase = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  text-transform: capitalize;
  border-radius: 99px;
  background-color: var(--background);
  color: var(--text);
  border: 2px solid var(--foreground);
  transition: all 150ms;
  font-size: 14px;

  ${Icon} {
    margin-right: 8px;
  }

  &:hover:not([disabled]) {
    cursor: pointer;
    transform: scale(0.97);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.42;
  }
`;

export const ButtonMajor = styled(ButtonBase)`
  background-color: var(--foreground);
  color: var(--background);

  ${Icon} {
    background: var(--background);
  }

  &:hover:not([disabled]) {
    background-color: var(--background);
    color: var(--foreground);

    ${Icon} {
      background: var(--foreground);
    }
  }
`;

export const ButtonMinor = styled(ButtonBase)`
  &:hover:not([disabled]) {
    background-color: var(--foreground);
    color: var(--background);

    ${Icon} {
      background: var(--background);
    }
  }
`;

export const ButtonTertiary = styled(ButtonBase)`
  border: 1px solid var(--accent);

  &:hover:not([disabled]) {
    color: var(--background);
    background-color: var(--highlight);
    border-color: var(--highlight);

    ${Icon} {
      background: var(--background);
    }
  }

  &:active:not([disabled]) {
    transform: scale(0.75);
  }
`;

export const ButtonSpecial = styled(ButtonBase)`
  background-color: var(--highlight);
  border-color: var(--highlight);
  color: white;

  ${Icon} {
    background: white;
  }
`;

export const ButtonLink = styled(ButtonBase)`
  border: 0;
  padding: 0;
  color: var(--text);
  background-color: unset;
`;

export const ButtonImage = styled(ButtonBase)`
  border: 0;
  padding: 0;
  width: 44px;
  height: 44px;

  > img {
    width: 100%;
    height: auto;
  }
`;

export const ButtonTag = styled(ButtonBase)`
  text-transform: lowercase;
  line-height: 14px;
`;
