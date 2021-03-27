import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';
import { DateTime } from 'pageUtils/post/styles';

const NamePlateWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-size: var(--fs-base-minus-1);
  color: var(--text-secondary);
  margin-left: -2.3em;

  > img {
    box-sizing: content-box;
    margin-right: 8px;
    border: 4px solid var(--bg-primary);
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
        width="24px"
        height="24px"
        alt={`${displayName}'s profile picture`}
      />
      <span>{displayName}</span>
      <span>&nbsp; &middot; &nbsp;</span>
      <DateTime>{date}</DateTime>
    </NamePlateWrapper>
  );
}
