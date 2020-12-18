import styled from '@emotion/styled';
import UserIcon from 'components/UserIcon';
import { useState } from 'react';

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

  > div {
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
  padding: 21px 21px 48px;
  font-weight: 500;

  > div:first-of-type {
    text-decoration: underline;
    margin: 0 0 20px 0;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;

    &:not(:last-of-type) {
      margin: 0 0 16px 0;
    }

    input {
      margin: unset;
      margin: 0 8px 0 0;

      &:checked::before {
        background: #000000;
        content: '';
        width: 13px;
        height: 13px;
        border-radius: 50%;
        display: block;
      }
    }
  }
`;

const RADIO_OPTIONS = {
  ALWAYS: 'Always',
  MENTIONS: 'Mentions',
  NEVER: 'Never',
};

export default function UserSettings({
  profileImg,
  displayName,
  userHandle,
  ...props
}) {
  const [value, setValue] = useState(RADIO_OPTIONS.ALWAYS);

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <Wrapper>
      <UserInfo>
        <SettingsUserIcon src={profileImg} alt={`${displayName}'s avatar`} />
        <div>{displayName}</div>
        <div>@{userHandle}</div>
      </UserInfo>
      <NotificationPreference>
        <div>Email Notifications</div>
        <RadioGroup>
          {Object.values(RADIO_OPTIONS).map(option => (
            <label htmlFor={option} key={option}>
              <input
                type="radio"
                id={option}
                name="option"
                value={option}
                checked={value === option}
                onChange={handleChange}
              />
              {option}
            </label>
          ))}
        </RadioGroup>
      </NotificationPreference>
    </Wrapper>
  );
}
