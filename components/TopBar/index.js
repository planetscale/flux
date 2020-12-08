import styled from '@emotion/styled';
import UserIcon from './UserIcon';
import Logout from './Logout';

const Wrapper = styled.div`
  width: 100%;
  height: 138px;
  border-bottom: 2px solid #000000;
  display: flex;
  justify-content: space-between;

  > div:first-of-type {
    display: flex;
    flex-direction: column;

    font-size: 36px;
    line-height: 38px;
    color: #000000;
    margin: 24px 0 0 48px;

    span {
      width: fit-content;
      display: inline-block;
      font-size: 24px;
      line-height: 25px;
      border-bottom: 2px solid black;
      margin: 20px 0 0 0;
    }
  }
`;

const UserIconWrapper = styled.div`
  margin: 18px 14px 0 0;
`;

export default function TopBar({
  org = 'PlanetScale',
  subOrg = 'Engineering',
}) {
  return (
    <Wrapper>
      <div>
        {org}
        <span>{subOrg}</span>
      </div>
      <UserIconWrapper>
        <UserIcon />
      </UserIconWrapper>
      <Logout />
    </Wrapper>
  );
}
