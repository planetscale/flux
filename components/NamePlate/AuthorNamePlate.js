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
  font-size: 14px;

  div:first-of-type {
    white-space: nowrap;
  }

  div:nth-of-type(2) {
    color: var(--text-secondary);
  }
`;

export default function AuthorNamePlate({ displayName, userHandle, avatar }) {
  return (
    <Wrapper>
      <UserIcon
        src={avatar || '/user_profile_icon.svg'}
        width="30px"
        height="30px"
        alt="user avatar"
      />
      <UserMetadata>
        <div>{displayName} </div>
        <div>@{userHandle}</div>
      </UserMetadata>
    </Wrapper>
  );
}
