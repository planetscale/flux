import styled from '@emotion/styled';
import { ButtonPrimary } from 'components/Button';
import { useAuthActions } from 'state/auth';

const StyledButtonPrimary = styled(ButtonPrimary)`
  margin: 0 38px 15px 38px;
`;

export default function Logout() {
  const { userLogout } = useAuthActions();

  const handleLogout = () => {
    userLogout();
  };

  return (
    <StyledButtonPrimary type="button" onClick={handleLogout}>
      Logout
    </StyledButtonPrimary>
  );
}
