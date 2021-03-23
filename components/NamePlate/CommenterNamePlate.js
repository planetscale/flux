import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';

const NamePlateWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-size: var(--fs-base-minus-1);
  color: var(--text-secondary);

  > img {
    margin-right: 16px;
  }
`;

export default function CommenterNamePlate({
  displayName,
  userHandle,
  avatar,
  date,
  ...props
}) {
  return (
    <NamePlateWrapper>
      <UserIcon
        src={avatar || '/user_profile_icon.svg'}
        width="32px"
        height="32px"
        alt={`${displayName}'s profile picture`}
      />
      <span>{displayName}</span>
      <span>&nbsp; &middot; &nbsp;</span>
      <span>{date}</span>
    </NamePlateWrapper>
  );
}
