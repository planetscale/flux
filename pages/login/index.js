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
  background: url('/bg_starfield.svg') var(--gray-900);
  border-left: 1px solid var(--border-primary);
`;

const Logo = styled.img`
  max-width: 260px;
`;

const AuthContainer = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
`;

const AuthTitle = styled.h1`
  font-weight: bold;
  font-size: var(--fs-base-plus-2);
  margin-bottom: 1em;
`;

const OAuthContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1em 0 0;
  margin: 2em 0;
  border-top: 1px solid var(--border-primary);

  > * {
    margin-right: 1em;
  }
`;

const OAuthTitle = styled.h2`
  font-weight: 400;
  font-size: var(--fs-base);
`;

export default function Login({ providers }) {
  const { user, loaded, isLoading } = useUserContext();

  const { getUser } = useUserActions();
  const router = useRouter();
  const [session, loading] = useSession();

  const NotEmailProviders = Object.values(providers).filter(
    r => r.name !== 'NoAuthEmail'
  );

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
            <AuthContainer>
              <AuthTitle>Login</AuthTitle>
              {Object.values(providers).reduce((accumulator, provider) => {
                const AuthLogin = AuthProviderLogins[provider.name];
                if (AuthLogin && provider.name === 'NoAuthEmail') {
                  accumulator.push(<AuthLogin key={provider.name} />);
                }
                return accumulator;
              }, [])}
              {NotEmailProviders.length > 0 && (
                <OAuthContainer>
                  <OAuthTitle>Or</OAuthTitle>
                  {Object.values(providers)
                    .filter(r => r.name !== 'NoAuthEmail')
                    .reduce((accumulator, provider) => {
                      const AuthLogin = AuthProviderLogins[provider.name];
                      if (AuthLogin) {
                        accumulator.push(<AuthLogin key={provider.name} />);
                      }
                      return accumulator;
                    }, [])}
                </OAuthContainer>
              )}
            </AuthContainer>
          )}
          {session && !loading && loaded && !user?.org && (
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
