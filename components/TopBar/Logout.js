import styled from '@emotion/styled';
import { useAuthActions } from 'state/auth';

const Wrapper = styled.div`
  img {
    border-radius: 50%;
  }
`;

export default function Logout() {
  const { userLogout } = useAuthActions();

  const handleLogout = () => {
    userLogout();
  };

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );
}
