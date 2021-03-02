import styled from '@emotion/styled';
import { media } from 'pageUtils/post/theme';
import CreateOrg from 'components/CreateOrg';
import { useUserContext, useUserActions } from 'state/user';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icon } from 'pageUtils/post/atoms';
import CustomLayout from 'components/CustomLayout';
import { signIn, useSession } from 'next-auth/client';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: url('/bg_starfield.png') #131516;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.phone`
    width: 100%;
  `}
`;

const LogoContainer = styled.div`
  margin-bottom: 2em;
  background: url('/bg_chaos_attractor_snapshot.png');
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  max-width: 260px;
`;

const AuthButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  max-width: 480px;
  margin-top: 2em;
`;

const AuthButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid white;
  background-color: #060a0c;
  border-radius: 99px;
  padding: 16px;
  outline: unset;
  box-shadow: var(--shadow);
  transition: all 300ms;
  color: white;

  &:hover {
    transform: scale(0.99);
  }

  &:active {
    transform: scale(0.97);
  }

  > ${Icon} {
    background: white;
  }

  > span {
    border-left: 1px solid var(--accent);
    padding: 0 8px;
    margin-left: 8px;
    text-transform: uppercase;
  }
`;

export default function Login() {
  const { user, loaded, isLoading } = useUserContext();

  const { getUser } = useUserActions();
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (user?.org) {
      router.push('/');
    }
  }, [user]);

  useEffect(() => {
    if (session && !loading && !isLoading) {
      getUser();
    }
  }, [session]);

  const handleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <CustomLayout>
      <Wrapper>
        <ContentContainer>
          {!session && (
            <LogoContainer>
              <Logo src="/logo_flux.svg" alt="Flux logo"></Logo>
              <AuthButtonContainer>
                <AuthButton onClick={handleLogin}>
                  <Icon className="icon-google"></Icon>
                  <span>Login With Google</span>
                </AuthButton>
              </AuthButtonContainer>
            </LogoContainer>
          )}
          {session && !loading && loaded && !user?.org && (
            <CreateOrg
              name={session?.user?.name}
              email={session?.user?.email}
              avatar={session?.user?.image ?? ''}
            />
          )}
        </ContentContainer>
      </Wrapper>
    </CustomLayout>
  );
}
