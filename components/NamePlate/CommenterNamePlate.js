import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';

const NamePlateWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  left: -46px;

  > img {
    margin-right: 16px;
  }
`;

const Name = styled.span`
  font-size: 14px;
  color: #666;
`;

const Date = styled.span`
  font-size: 14px;
  color: #666;
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
      <Name>{displayName}</Name>
      <span>&nbsp; &middot; &nbsp;</span>
      <Date>{date}</Date>
    </NamePlateWrapper>
  );
}
