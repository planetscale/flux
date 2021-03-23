import styled from '@emotion/styled';
import { media } from 'pageUtils/post/theme';
import CreateOrg from 'components/CreateOrg';
import { useUserContext, useUserActions } from 'state/user';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomLayout from 'components/CustomLayout';
import { providers, useSession } from 'next-auth/client';
import * as AuthProviderLogins from 'authentication/components/';

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

export default function Login({ providers }) {
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
  }, [session, loading]);

  return (
    <CustomLayout>
      <Wrapper>
        <ContentContainer>
          {!session && (
            <LogoContainer>
              <Logo src="/logo_flux.svg" alt="Flux logo"></Logo>
              {Object.values(providers).reduce((accumulator, provider) => {
                const AuthLogin = AuthProviderLogins[provider.name];
                if (AuthLogin) {
                  accumulator.push(<AuthLogin key={provider.name} />);
                }
                return accumulator;
              }, [])}
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

Login.getInitialProps = async () => {
  return {
    providers: await providers(),
  };
};
