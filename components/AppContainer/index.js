import { useEffect, useState } from 'react';
import { UserContextProvider } from 'state/user';
import {
  setDefaultFetchHeaders,
  setFireAuthObserver,
} from 'utils/auth/clientConfig';
import AuthGuard from 'components/AuthGuard';
import { useAuthActions } from 'state/auth';
import AppContentWrapper from './AppContentWrapper';
import { useRouter } from 'next/router';
import { TopBarContextProvider } from 'state/topBar';

function AppContainer({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const {
    rehydrateUser,
    setUserAuthChecked,
    isValidUser,
    userLogout,
  } = useAuthActions();

  useEffect(() => {
    setFireAuthObserver(onAuthUserFailed, onAuthUserSuccess);
  }, []);

  const onAuthUserSuccess = user => {
    // Ensure a user with bad email can't use the product after the sign in phase
    if (user && !isValidUser(user)) {
      return userLogout();
    }
    updateToken(user);
    rehydrateUser(user);
  };

  const onAuthUserFailed = () => {
    setUserAuthChecked();
  };

  const updateToken = async user => {
    try {
      const jwt = await user.getIdToken(true);
      setToken(jwt);
      setDefaultFetchHeaders({
        authorization: jwt ? `Bearer ${jwt}` : '',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isLoginPage = () => {
    return router.pathname === '/login';
  };

  return (
    <UserContextProvider>
      <AuthGuard token={token}>
        <TopBarContextProvider>
          {isLoginPage() ? (
            <>{children}</>
          ) : (
            <AppContentWrapper token={token}>{children}</AppContentWrapper>
          )}
        </TopBarContextProvider>
      </AuthGuard>
    </UserContextProvider>
  );
}

export default AppContainer;
