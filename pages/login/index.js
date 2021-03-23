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
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: stretch;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${media.phone`
    width: 100%;
  `}
`;

const LogoColumn = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url('/bg_starfield.png') var(--bg-primary);
  border-left: 1px solid var(--border-primary);
`;

const LogoContainer = styled.div`
  margin-bottom: 2em;
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
              {Object.values(providers).map(provider => {
                const AuthLogin = AuthProviderLogins[provider.name];
                return <AuthLogin key={provider.name} />;
              })}
            </LogoContainer>
          )}
          {!session && !loading && loaded && !user?.org && (
            <CreateOrg
              name={session?.user?.name}
              email={session?.user?.email}
              avatar={session?.user?.image ?? ''}
            />
          )}
        </ContentContainer>
        <LogoColumn>
          <Logo src="/logo_flux.svg" alt="Flux logo"></Logo>
        </LogoColumn>
      </Wrapper>
    </CustomLayout>
  );
}

Login.getInitialProps = async () => {
  return {
    providers: await providers(),
  };
};
