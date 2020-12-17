import styled from '@emotion/styled';
import { ButtonBase } from 'components/Button';

const Wrapper = styled.div`
  height: 100vh;
  width: 236px;
  box-sizing: border-box;
  border: 1px solid #000000;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);

  img {
    margin: 20px 0 44px 24px;
  }

  > div:first-of-type {
    height: fit-content;
    border-bottom: 1px solid #000000;
    padding: 24px;

    > ${ButtonBase} {
      font: unset;
      font-family: inherit;
      display: block;
      font-weight: 500;
      font-size: 20px;
      line-height: 21px;
      color: #000000;
    }

    > ${ButtonBase}:not(:last-of-type) {
      margin: 0 0 16px 0;
    }
  }
`;

const LowerContainer = styled.div`
  height: 100%;
  padding: 24px;

  > div {
    margin: 0 0 44px 0;

    ${ButtonBase}:first-of-type {
      font-size: 18px;
      line-height: 19px;
      color: #000000;
    }

    ${ButtonBase}:not(:first-of-type) {
      font-weight: 300;
      font-size: 16px;
      line-height: 17px;
      text-decoration-line: underline;
      margin: 20px 0 0 20px;
      color: #000000;
    }
  }
`;

export default function Navbar({
  titles = ['All', 'Home'],
  orgs = [
    {
      name: 'Planetscale',
      lenses: ['Marketing', 'Industry', 'Engineering'],
    },
    { name: 'PS Culture', lenses: ['Events', 'New Members', 'Misc'] },
  ],
}) {
  return (
    <Wrapper>
      <img src="/icon.svg" alt="parallax logo" />
      <div>
        {titles.map(title => (
          <ButtonBase key={title}>
            <div>{title}</div>
          </ButtonBase>
        ))}
      </div>
      <LowerContainer>
        {orgs?.map(org => {
          return (
            <div key={org.name}>
              <ButtonBase>{org.name}</ButtonBase>
              {org.lenses.map(lens => (
                <ButtonBase key={lens}>
                  <div>{lens}</div>
                </ButtonBase>
              ))}
            </div>
          );
        })}
      </LowerContainer>
    </Wrapper>
  );
}
