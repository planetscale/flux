import styled from '@emotion/styled';

const Wrapper = styled.div`
  img {
    border-radius: 50%;
  }
`;

export default function UserIcon({ img = '/user_profile_icon.png' }) {
  return (
    <Wrapper>
      <img src={img} alt="next" />
    </Wrapper>
  );
}
