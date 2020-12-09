import styled from '@emotion/styled';

const Wrapper = styled.div`
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

// TODO: discard the wrapper, only create a styled.img emotion component, and change the reference to the UserIcon component accordingly
export default function UserIcon({
  img = '/user_profile_icon.png',
  className,
}) {
  return (
    <Wrapper className={className}>
      <img src={img} alt="user profile avatar" />
    </Wrapper>
  );
}
