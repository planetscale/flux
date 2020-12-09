import styled from '@emotion/styled';
import Input from 'components/Input';

const Wrapper = styled.div`
  padding: 24px;
  width: 616px;
  height: fit-content;
  background: #ffffff;
  border: 2px solid #000000;

  > div {
    width: 100%;
    height: fit-content;
    border: 1px solid #000000;
  }
`;

const InputWrapper = styled.div`
  border-bottom: 1px solid #e1e1e1;
  padding: 16px;
`;

const ButtonWrapper = styled.div`
  padding: 16px;
`;

const Button = styled.button`
  width: 71px;
  height: 48px;
  background: #ffffff;
  border: 2px solid #000000;
  cursor: pointer;

  :focus {
    outline: unset;
  }
`;

export default function CreateOrg() {
  return (
    <Wrapper>
      <div>
        <InputWrapper>
          <Input label="Organization Name" />
        </InputWrapper>
        <InputWrapper>
          <Input label="Your Name" />
        </InputWrapper>
        <ButtonWrapper>
          <Button type="submit">Next</Button>
        </ButtonWrapper>
      </div>
    </Wrapper>
  );
}
