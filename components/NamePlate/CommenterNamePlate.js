import styled from '@emotion/styled';

const Wrapper = styled.div`
  line-height: 17px;
  margin: 0 0 12px 0;

  > span:nth-of-type(2) {
    opacity: 0.5;
  }
`;

export default function CommenterNamePlate({
  displayName,
  userHandle,
  ...props
}) {
  return (
    <Wrapper>
      <span>{displayName} </span>
      <span>{userHandle}</span>
    </Wrapper>
  );
}
