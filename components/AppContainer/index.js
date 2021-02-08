import React, { useEffect, useState } from 'react';
import { UserContextProvider } from 'state/user';
import { setFireAuthObserver, getToken } from 'utils/auth/clientConfig';
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
    rehydrateUser(user);
    getToken().then(token => {
      setToken(token);
    });
  };

  const onAuthUserFailed = () => {
    setUserAuthChecked();
  };

  const isLoginPage = () => {
    return router.pathname === '/login';
  };

  return (
    <UserContextProvider>
      <TopBarContextProvider>
        {isLoginPage() ? (
          React.cloneElement(children, { token })
        ) : (
          <AuthGuard>
            <AppContentWrapper token={token}>{children}</AppContentWrapper>
          </AuthGuard>
        )}
      </TopBarContextProvider>
    </UserContextProvider>
  );
}

export default AppContainer;
