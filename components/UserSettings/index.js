import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';

const Wrapper = styled.div`
  width: 360px;
  background: #ffffff;
  border: 2px solid #000000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;

  > div:not(:first-of-type) {
    margin: 12px 0 0 0;
  }

  > div:last-of-type {
    opacity: 0.5;
  }
`;

const SettingsUserIcon = styled(UserIcon)`
  width: 116px;
  height: 116px;
`;

const NotificationPreference = styled.div`
  padding: 21px;
  font-weight: 500;

  > div {
    text-decoration: underline;
  }
`;

export default function UserSettings({
  profileImg,
  displayName = 'Abhi Vaidyanatha',
  userHandle = 'abhi',
  ...props
}) {
  return (
    <Wrapper>
      <UserInfo>
        <SettingsUserIcon img={profileImg} />
        <div>{displayName}</div>
        <div>@{userHandle}</div>
      </UserInfo>
      <NotificationPreference>
        <div>Email Notifications</div>
        <ul>
          <li>Always</li>
          <li>Mentions</li>
          <li>Never</li>
        </ul>
      </NotificationPreference>
    </Wrapper>
  );
}
