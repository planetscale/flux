import React, { useEffect, useState } from 'react';
import { UserContextProvider } from 'state/user';
import useSWR from 'swr';
import {
  setDefaultFetchHeaders,
  setFireAuthObserver,
} from 'utils/auth/clientConfig';
import AuthGuard from 'components/AuthGuard';
import { useAuthActions } from 'state/auth';
import AppContentWrapper from './AppContentWrapper';
import { useRouter } from 'next/router';
import { TopBarContextProvider } from 'state/topBar';
import { useAuthContext } from 'state/auth';

const TOKEN_REFRESH_TIMER = 30 * 60 * 1000;

function AppContainer({ children }) {
  const { user: authUser } = useAuthContext();

  // Once authenticated, every TOKEN_REFRESH_TIMER milliseconds refresh the header automatically.
  // This logic will need to be changed if we want to set a user timeout
  useSWR(
    [authUser ? 'refreshtoken' : null, authUser],
    (_, user) => user.getIdToken(true),
    {
      refreshInterval: TOKEN_REFRESH_TIMER,
      onSuccess: token => {
        setToken(token);
        setDefaultFetchHeaders({
          authorization: token ? `Bearer ${token}` : '',
        });
      },
    }
  );

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
