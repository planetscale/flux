import styled from '@emotion/styled';

const StyledIcon = styled.img`
  border-radius: var(--border-radius);
`;

export default function UserIcon({ ...props }) {
  const replaceImgOnError = e => {
    e.target.src = '/user_profile_icon.svg';
  };

  return <StyledIcon onError={replaceImgOnError} {...props} />;
}
