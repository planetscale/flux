import React from 'react';
import { UserContextProvider } from 'state/user';
import AuthGuard from 'components/AuthGuard';
import AppContentWrapper from './AppContentWrapper';
import { useRouter } from 'next/router';
import { TopBarContextProvider } from 'state/topBar';

function AppContainer({ children }) {
  const router = useRouter();

  const isLoginPage = () => {
    return router.pathname === '/login';
  };

  return (
    <UserContextProvider>
      <TopBarContextProvider>
        {isLoginPage() ? (
          React.cloneElement(children)
        ) : (
          <AuthGuard>
            <AppContentWrapper>{children}</AppContentWrapper>
          </AuthGuard>
        )}
      </TopBarContextProvider>
    </UserContextProvider>
  );
}

export default AppContainer;
