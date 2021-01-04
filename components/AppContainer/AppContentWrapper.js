import styled from '@emotion/styled';
import Navbar from 'components/NavBar';
import TopBar from 'components/TopBar';
import { useAuthContext } from 'state/auth';
import { useMutation, useQuery } from 'urql';
import { useUserContext } from 'state/user';
import gql from 'graphql-tag';

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

const sideNavDataQuery = gql`
  query {
    orgs {
      id
      name
      lenses {
        id
        name
      }
    }
  }
`;

const createLensMutation = gql`
  mutation($lensName: String!, $desc: String!, $orgId: Int!) {
    createOneLens(
      data: {
        name: $lensName
        description: $desc
        org: { connect: { id: $orgId } }
      }
    ) {
      name
    }
  }
`;

export default function AppContentWrapper({ children }) {
  const authContext = useAuthContext();
  const { user } = useUserContext();
  const [sideNavResult, runSideNavDataQuery] = useQuery({
    query: sideNavDataQuery,
  });
  const [createLensResult, createLens] = useMutation(createLensMutation);

  const handleLensCreate = async (orgId, lensName) => {
    try {
      const result = await createLens({
        lensName,
        desc: '',
        orgId,
      });

      if (result && !result.error) {
        runSideNavDataQuery();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      {authContext.isAuthed && (
        <MainWrapper>
          <Navbar
            orgs={sideNavResult.data?.orgs ?? []}
            handleLensCreate={handleLensCreate}
          />
          <CenterWrapper>
            <TopBar
              profileImg={user?.profile?.avatar ?? '/user_profile_icon.svg'}
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
