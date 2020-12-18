import { useEffect, useState } from 'react';
import { UserContextProvider } from 'state/user';
import { setFireAuthObserver } from 'utils/auth/clientConfig';
import { createClient, Provider, fetchExchange, cacheExchange } from 'urql';
import AuthGuard from 'components/AuthGuard';
import { useAuthActions } from 'state/auth';
import AppContentWrapper from './AppContentWrapper';
import { useRouter } from 'next/router';

// the URL to /api/graphql
const GRAPHQL_ENDPOINT = `http://localhost:3000/api/graphql`;

function AppContainer({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const { rehydrateUser } = useAuthActions();

  useEffect(() => {
    setFireAuthObserver(null, onAuthUserSuccess);
  }, []);

  const onAuthUserSuccess = user => {
    updateToken(user);
    rehydrateUser(user);
  };

  const updateToken = async user => {
    try {
      const jwt = await user.getIdToken();
      setToken(jwt);
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
      exchanges: [cacheExchange, fetchExchange],
    });
  };

  const isLoginPage = () => {
    return router.pathname === '/login';
  };

  return (
    <Provider value={createUrqlClient(token)}>
      <UserContextProvider>
        <AuthGuard token={token}>
          {isLoginPage() ? (
            <>{children}</>
          ) : (
            <AppContentWrapper>{children}</AppContentWrapper>
          )}
          <AppContentWrapper>{children}</AppContentWrapper>
        </AuthGuard>
      </UserContextProvider>
    </Provider>
  );
}

export default AppContainer;
