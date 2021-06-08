import { signIn } from 'next-auth/client';
import styled from '@emotion/styled';
import { ButtonWireframe } from 'components/Button';
import { InputWrapper } from 'pageUtils/post/styles';
import Input from 'components/Input';
import { useState } from 'react';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const FormWrapper = styled.div`
  outline: unset;
  color: var(--text-primary);
`;

const LoginInfoPlaceholder = styled.div`
  color: var(--text-secondary);
  margin-top: 2em;
  font-size: var(--fs-base-minus-2);
`;

export default function NoAuthEmail() {
  const [email, setEmail] = useState('');

  const handleLogin = event => {
    event.preventDefault();
    signIn('credentials', { email: event.target.email.value });
  };

  const handleEmailChange = e => {
    let target = e.target;
    let targetWrapper = target.parentNode.parentNode;

    setEmail(e.target.value);

    if (target.value.length > 0) {
      targetWrapper.classList.remove('error');
    } else {
      targetWrapper.classList.add('error');
    }
  };

  return (
    <AuthContainer>
      <FormWrapper>
        <form onSubmit={handleLogin}>
          <InputWrapper>
            <Input
              required
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </InputWrapper>
          <ButtonWireframe className="primary" type="submit">
            Login/Sign Up
          </ButtonWireframe>
        </form>
        <LoginInfoPlaceholder>
          The default email authentication process is purely for demo purposes.
          You will assume the identify of the email you provide, as will any
          other user. For use in any sensitive or collaborative application
          please apply your own authentication following next-auth's{' '}
          <a href="https://github.com/planetscale/flux/blob/main/authentication/README.md">
            guide
          </a>
          .
        </LoginInfoPlaceholder>
      </FormWrapper>
    </AuthContainer>
  );
}
