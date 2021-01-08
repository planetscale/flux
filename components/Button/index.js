import styled from '@emotion/styled';

export const ButtonBase = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  text-transform: capitalize;
  border-radius: 99px;
  background-color: var(--background);
  border: 2px solid var(--foreground);
  transition: all 150ms;

  > img {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }

  &:hover {
    cursor: pointer;

    > img {
      filter: invert(100%);
    }
  }

  &:focus {
    outline: none;
  }
`;

export const ButtonMajor = styled(ButtonBase)`
  background-color: var(--foreground);
  color: var(--background);

  &:hover {
    background-color: var(--background);
    color: var(--foreground);
  }
`;

export const ButtonMinor = styled(ButtonBase)`
  &:hover {
    background-color: var(--foreground);
    color: var(--background);
  }
`;
