import styled from '@emotion/styled';

const Icon = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  background: var(--text-primary);
  -webkit-mask-size: cover;
  -webkit-mask-repeat: no-repeat;

  &.icon-google {
    mask: url('/logo_google.svg');
  }
`;

export { Icon };
