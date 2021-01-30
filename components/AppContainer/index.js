import { useEffect, useState } from 'react';
import { UserContextProvider } from 'state/user';
import {
  setDefaultFetchHeaders,
  setFireAuthObserver,
} from 'utils/auth/clientConfig';
import { createClient, Provider, fetchExchange, cacheExchange } from 'urql';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import AuthGuard from 'components/AuthGuard';
import { useAuthActions } from 'state/auth';
import AppContentWrapper from './AppContentWrapper';
import { useRouter } from 'next/router';
import { TopBarContextProvider } from 'state/topBar';

const GRAPHQL_ENDPOINT = `/api`;

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
      const jwt = await user.getIdToken();
      setToken(jwt);
      setDefaultFetchHeaders({
        authorization: jwt ? `Bearer ${jwt}` : '',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const createUrqlClient = token => {
    return createClient({
      url: GRAPHQL_ENDPOINT,
      fetchOptions: () => {
        return {
          headers: { authorization: token ? `Bearer ${token}` : '' },
        };
      },
      // TODO: add dedupExchange to this array and check cache before fire api request
      // cacheExchange, dedupExchange, multipartFetchExchange
      exchanges: [multipartFetchExchange],
    });
  };

  const isLoginPage = () => {
    return router.pathname === '/login';
  };

  return (
    <Provider value={createUrqlClient(token)}>
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
    </Provider>
  );
}

export default AppContainer;
