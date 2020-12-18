import styled from '@emotion/styled';
import Navbar from 'components/NavBar';
import TopBar from 'components/TopBar';
import { useAuthContext } from 'state/auth';
import { useQuery } from 'urql';
import { useUserContext } from 'state/user';

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
`;
const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const sideNavDataQuery = `
  query {
    orgs {
      name
      lenses {
        name
      }
    }
  }
`;

export default function AppContentWrapper({ children }) {
  console.log('Content Wrapper');
  const authContext = useAuthContext();
  const { user } = useUserContext();
  const [sideNavResult, runSideNavDataQuery] = useQuery({
    query: sideNavDataQuery,
  });

  return (
    <main>
      {authContext.isAuthed && (
        <MainWrapper>
          <Navbar orgs={sideNavResult.data?.orgs} />
          <CenterWrapper>
            <TopBar
              org={user?.org.name}
              subOrg="Engineering"
              profileImg={user?.profile?.avatar ?? '/user_profile_icon.png'}
              userDisplayName={user?.displayName}
              userHandle={user?.username}
            />
            {children}
          </CenterWrapper>
        </MainWrapper>
      )}
    </main>
  );
}
