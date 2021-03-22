import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UserMetadata = styled.div`
  margin: 0 0 0 16px;
  display: flex;
  flex-direction: column;
  color: var(--text-primary);

  span:first-of-type {
    height: 22px;
    font-size: 18px;
    line-height: 22px;
  }

  span:nth-of-type(2) {
    height: 19px;
    font-size: 16px;
    line-height: 19px;
    color: var(--text-primary);
  }
`;

export default function AuthorNamePlate({ displayName, userHandle, avatar }) {
  return (
    <Wrapper>
      <UserIcon
        src={avatar || '/user_profile_icon.svg'}
        width="34px"
        height="34px"
        alt="user avatar"
      />
      <UserMetadata>
        <span>{displayName} </span>
        <span>@{userHandle}</span>
      </UserMetadata>
    </Wrapper>
  );
}
