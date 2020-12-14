import styled from '@emotion/styled';

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

    > div {
      font-weight: 500;
      font-size: 20px;
      line-height: 21px;
      color: #000000;
    }

    > div:not(:last-of-type) {
      margin: 0 0 16px 0;
    }
  }

  > div:nth-of-type(2) {
    height: 100%;
    padding: 24px;

    > div {
      font-size: 18px;
      line-height: 19px;
      margin: 0 0 44px 0;
      color: #000000;

      div {
        font-weight: 300;
        font-size: 16px;
        line-height: 17px;
        text-decoration-line: underline;
        margin: 20px 0 0 20px;
        color: #000000;
      }
    }
  }
`;

export default function Navbar({
  titles = ['All', 'Home'],
  categories = {
    Planetscale: {
      subs: ['Marketing', 'Industry', 'Engineering'],
    },
    'PS Culture': { subs: ['Events', 'New Members', 'Misc'] },
  },
}) {
  return (
    <Wrapper>
      <img src="/icon.svg" alt="parallax logo" />
      <div>
        {titles.map(title => (
          <div key={title}>{title}</div>
        ))}
      </div>
      <div>
        {Object.entries(categories).map(([k, v]) => {
          return (
            <div key={k}>
              {k}
              {v.subs.map(sub => (
                <div key={sub}>{sub}</div>
              ))}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
}
