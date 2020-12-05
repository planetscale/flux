import styled from '@emotion/styled';
import Navbar from 'components/NavBar';
import PostList from 'components/PostList';
import TopBar from 'components/TopBar';

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
`;
const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default function Login() {
  const handleLogin = () => {
    if (actions.userLogin) {
      actions.userLogin;
    }
  };

  return (
    <MainWrapper>
      <Navbar />
      <CenterWrapper>
        <TopBar />
        <PostList />
      </CenterWrapper>
    </MainWrapper>
  );
}

// {
//   /* <button type="button" onClick={handleLogin}>
//         login
//       </button> */
// }
