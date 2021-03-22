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
  font-size: 1em;
  height: fit-content;

  svg {
    width: 1em;
    height: 1em;
    margin-right: 0.5em;
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
    color: rgb(var(--blue-500));
    background-color: rgb(var(--blue-100));

    &:hover:not([disabled]) {
      background-color: var(--highlight);
    }
  }
`;

export const ButtonSquished = styled(ButtonWireframe)`
  padding: 4px 16px;
  font-size: 0.9em;
`;

export const ButtonTertiary = styled(ButtonBase)`
  border: 1px solid var(--accent);

  &:hover:not([disabled]) {
    color: var(--bg-primary);
    background-color: var(--highlight);
    border-color: var(--highlight);

    ${Icon} {
      background: var(--bg-primary);
    }
  }

  &:active:not([disabled]) {
    transform: scale(0.75);
  }
`;

export const ButtonSpecial = styled(ButtonBase)`
  background-color: var(--highlight);
  border-color: var(--highlight);
  color: var(--pink-500);

  ${Icon} {
    background: white;
  }
`;

export const ButtonLink = styled(ButtonBase)`
  border: 0;
  padding: 0;
  color: var(--text-primary);
  background-color: unset;
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

export const ButtonTag = styled(ButtonBase)`
  text-transform: lowercase;
  line-height: 14px;
`;

export const ButtonComposite = styled.a`
  display: flex;
  flex-direction: row;
  font-size: 24px;
  padding: 4px 8px;
  border-radius: 6px;

  &:hover:not([disabled]) {
    cursor: pointer;
  }
`;
