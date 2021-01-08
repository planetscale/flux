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
  font-size: 14px;

  > img {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }

  &:hover {
    cursor: pointer;
    transform: scale(0.97);

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

export const ButtonLink = styled(ButtonBase)`
  border: 0;
  padding: 0;
`;

export const ButtonImage = styled(ButtonBase)`
  border: 0;
  padding: 0;
  width: 38px;
  height: 38px;

  > img {
    width: 100%;
    height: auto;
  }

  :hover {
    > img {
      filter: unset;
    }
  }
`;
