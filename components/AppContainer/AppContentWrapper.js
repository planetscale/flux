import styled from '@emotion/styled';
import TopBar from 'components/TopBar';
import { useAuthContext } from 'state/auth';
import { useUserContext } from 'state/user';

const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function AppContentWrapper({ children }) {
  const authContext = useAuthContext();
  const { user } = useUserContext();

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
