import styled from '@emotion/styled';
import TopBar from 'components/TopBar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthContext } from 'state/auth';
import { useTopBarActions } from 'state/topBar';
import { useUserContext } from 'state/user';

const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function AppContentWrapper({ children }) {
  const router = useRouter();
  const authContext = useAuthContext();
  const { user } = useUserContext();
  const { setHeaders } = useTopBarActions();

  useEffect(() => {
    if (router.pathname === '/new') {
      setHeaders({
        subHeader: 'Add a new post',
      });
    } else {
      setHeaders({
        subHeader: 'all',
      });
    }
  }, [router]);

  return (
    <main>
      {authContext.isAuthed && (
        <CenterWrapper>
          <TopBar
            profileImg={user?.profile?.avatar ?? '/user_profile_icon.svg'}
            userDisplayName={user?.displayName}
            userHandle={user?.username}
          />
          {children}
        </CenterWrapper>
      )}
    </main>
  );
}
