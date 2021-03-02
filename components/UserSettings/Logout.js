import { ButtonMajor } from 'components/Button';
import { useAuthActions } from 'state/auth';

export default function Logout() {
  const { userLogout } = useAuthActions();

  const handleLogout = () => {
    userLogout();
  };

  return (
    <ButtonMajor type="button" onClick={handleLogout}>
      Log Out
    </ButtonMajor>
  );
}
