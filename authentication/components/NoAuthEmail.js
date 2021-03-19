import { signIn } from 'next-auth/client';
import styled from '@emotion/styled';
import { ButtonTertiary } from 'components/Button';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  max-width: 480px;
  margin-top: 2em;
`;

const FormWrapper = styled.div`
  align-items: center;
  border: 1px solid white;
  background-color: #060a0c;
  border-radius: 16px;
  padding: 16px;
  outline: unset;
  box-shadow: var(--shadow);
  color: white;

  div.title {
    text-align: center;
    text-transform: uppercase;
  }
  div.info {
    margin-top: 16px;
    font-size: 0.75rem;
  }

  form {
    input {
      margin: 16px 0px;
      width: 100%;
      padding: 12px 8px;
    }

    button {
      margin-left: auto;
      box-sizing: inherit;
      width: 100%;
      justify-content: center;
    }
  }
`;

export default function NoAuthEmail() {
  const handleLogin = event => {
    event.preventDefault();

    signIn('credentials', { email: event.target.email.value });
  };

  return (
    <AuthContainer>
      <FormWrapper>
        <div className="title">
          <span>Login/Sign Up With Email</span>
        </div>
        <form onSubmit={handleLogin}>
          <input id="email" type="email" required placeholder="Email" />
          <ButtonTertiary type="submit">Login/Sign Up</ButtonTertiary>
        </form>
        <div className="info">
          Please note this login process does not perform any authentication or
          verification of identity and is purely for trial purposes. You will
          assume the identify of the email you provide, as will any other user.
          For use in any sensitive or collaborative application please apply
          your own authentication following this{' '}
          <a href="https://github.com/planetscale/flux/blob/main/authentication/README.md">
            guide
          </a>
          .
        </div>
      </FormWrapper>
    </AuthContainer>
  );
}
