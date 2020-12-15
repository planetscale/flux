import styled from '@emotion/styled';

const Wrapper = styled.div`
  width: 700px;
  padding: 32px 28px;
  background: #ffffff;
  border: 2px solid #000000;
`;

const Header = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 25px;
  border-bottom: 2px solid black;
  width: fit-content;
  margin: 0 0 38px 0;
`;

const Body = styled.div`
  > div {
    &:not(:last-of-type) {
      margin: 0 0 20px 0;
    }

    div {
      font-weight: bold;
      font-size: 24px;
      line-height: 25px;
      margin: 0 0 16px 0;
    }

    button {
      border: none;
      background-color: unset;
      cursor: pointer;
      margin: 0 0 0 38px;
      background: #ffffff;
      border: 1px solid #423f3f;
      box-sizing: border-box;
      border-radius: 4px;
      padding: 5px 18px;
      font-weight: 500;
      font-size: 16px;
      line-height: 18px;

      &:focus {
        outline: none;
      }
    }
  }
`;

export default function PostUpload() {
  return (
    <Wrapper>
      <Header>Upload Markdown</Header>
      <Body>
        <div>
          <div>1. Get the template.</div>
          <button type="button">Download</button>
        </div>
        <div>
          <div>2. Upload.</div>
          <button type="button">Choose your file</button>
        </div>
      </Body>
    </Wrapper>
  );
}
