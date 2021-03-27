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

  ${media.phone`
    flex-direction: column-reverse;
  `}
`;

const ContentContainer = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${media.phone`
    width: 100vw;
    flex-grow: 2;
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

  ${media.phone`
    width: 100vw;
    height: 25vh;
    border-left: unset;
    border-bottom: 1px solid var(--border-primary);
  `}
`;

const Logo = styled.img`
  max-width: 260px;

  ${media.phone`
    max-width: 130px;
  `}
`;

const AuthContainer = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;

  > *:not(:last-child) {
    margin-bottom: 1em;
  }

  ${media.phone`
    width: unset;
    padding: 0 2em;
  `}
`;

const AuthTitle = styled.h1`
  font-weight: bold;
  font-size: var(--fs-base-plus-2);
`;

const OAuthContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 1em;
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

  const EmailProvider = Object.values(providers).filter(
    r => r.name === 'Email'
  );

  const NotEmailProviders = Object.values(providers).filter(
    r => r.name !== 'Email'
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
              {EmailProvider.length > 0 &&
                EmailProvider.reduce((accumulator, provider) => {
                  const AuthLogin = AuthProviderLogins[provider.name];
                  if (AuthLogin) {
                    accumulator.push(<AuthLogin key={provider.name} />);
                  }
                  return accumulator;
                }, [])}
              {NotEmailProviders.length > 0 && (
                <OAuthContainer>
                  {EmailProvider.length > 0 && <OAuthTitle>Or</OAuthTitle>}
                  {Object.values(providers)
                    .filter(r => r.name !== 'Email')
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
