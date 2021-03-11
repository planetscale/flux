import styled from '@emotion/styled';
import { media } from '../../pageUtils/post/theme';
import { Icon } from 'pageUtils/post/atoms';

export const ButtonBase = styled.button`
  box-sizing: content-box;
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
  font-size: 1em;
  height: fit-content;

  ${Icon} {
    width: 20px;
    height: 20px;
    margin: 0 0.5em 0 0;
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

export const ButtonWireframe = styled(ButtonBase)`
  border-color: ${props => props.color || 'var(--foreground)'};

  &:hover:not([disabled]) {
    background-color: ${props => props.color || 'var(--foreground)'};
    color: white;

    ${Icon} {
      background: white;
    }
  }

  &.selected {
    color: var(--highlight);
    border-color: var(--highlight);

    ${Icon} {
      background: var(--highlight);
    }

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
  transition: all 150ms;

  &:hover:not([disabled]) {
    cursor: pointer;
    background-color: var(--accent3);
    transform: scale(0.97);
  }
`;
