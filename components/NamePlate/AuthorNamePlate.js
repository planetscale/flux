import styled from '@emotion/styled';
import { getLocaleDateTimeString } from 'utils/dateTime';

const Wrapper = styled.div`
  margin: 0 0 24px 0;

  > div:first-of-type {
    line-height: 25px;
    margin: 0 0 6px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span:first-of-type {
      font-size: 24px;
    }

    span:not(:first-of-type) {
      opacity: 0.5;
    }
  }

  > div:not(:first-of-type) {
    font-size: 14px;
    line-height: 15px;
    opacity: 0.5;
  }
`;

const Stars = styled.div`
  display: flex;
  align-items: baseline;
  font-size: 18px;

  :hover {
    cursor: pointer;
  }

  img {
    margin: 0 0 0 8px;
  }
`;

export default function AuthorNamePlate({
  displayName,
  userHandle,
  time,
  numComments,
  numStars,
  onStarClick = null,
  ...props
}) {
  return (
    <Wrapper>
      <div>
        <div>
          <span>{displayName} </span>
          <span>{userHandle}</span>
        </div>
        <Stars onClick={onStarClick}>
          {numStars} <img src="/star.svg" alt="star" />
        </Stars>
      </div>
      <div>
        {getLocaleDateTimeString(time)} | {numComments} comments
      </div>
    </Wrapper>
  );
}
