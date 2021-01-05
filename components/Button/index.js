import styled from '@emotion/styled';

export const ButtonBase = styled.button`
  border: none;
  background-color: unset;
  cursor: pointer;
  padding: unset;
  text-transform: capitalize;
  display: block;

  &:focus {
    outline: none;
  }
`;

export const ButtonPrimary = styled(ButtonBase)`
  background: #ffffff;
  border: 1px solid #423f3f;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 5px 18px;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
`;
