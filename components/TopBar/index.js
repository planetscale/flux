import styled from '@emotion/styled';
import {
  ButtonWireframe,
  ButtonComposite,
  ButtonSquished,
} from 'components/Button';
import getConfig from 'next/config';
import UserSettings from 'components/UserSettings';
import { useEffect } from 'react';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useRouter } from 'next/router';
import { useUserContext } from 'state/user';
import { Add } from '@styled-icons/remix-line';
import { Hashtag } from '@styled-icons/remix-editor';
import { media } from '../../pageUtils/post/theme';
import Notifications from 'components/Notifications';

const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 2em 2em 0;
  position: sticky;
  top: 0;
  z-index: 1;

  ${media.phone`
    padding: 2em 1em 0;
  `};
`;

const Constrain = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 86ch;
`;

const Logo = styled.div`
  letter-spacing: -1px;
  font-size: var(--fs-base);
  border-radius: unset;
  padding: 0 4px;
  font-family: 'Raleway', sans-serif;
  font-feature-settings: 'liga';
  font-style: italic;
  font-weight: 900;
  background: linear-gradient(90deg, rgb(var(--pink-500)), rgb(var(--blue-500))),
    var(--text-primary);
  background-clip: text;
  background-size: 200% 200%;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;

  -webkit-animation: AnimateLogoGradient 5s ease infinite;
  -moz-animation: AnimateLogoGradient 5s ease infinite;
  animation: AnimateLogoGradient 5s ease infinite;

  @-webkit-keyframes AnimateLogoGradient {
    0% {
      background-position: 0% 90%;
    }
    50% {
      background-position: 100% 11%;
    }
    100% {
      background-position: 0% 90%;
    }
  }
  @-moz-keyframes AnimateLogoGradient {
    0% {
      background-position: 0% 90%;
    }
    50% {
      background-position: 100% 11%;
    }
    100% {
      background-position: 0% 90%;
    }
  }
  @keyframes AnimateLogoGradient {
    0% {
      background-position: 0% 90%;
    }
    50% {
      background-position: 100% 11%;
    }
    100% {
      background-position: 0% 90%;
    }
  }

  ${media.phone`
    font-size: var(--fs-base);
  `}
`;

const ForwardSlash = styled.div`
  color: var(--border-primary);
  margin: 0 0.5em;
`;

const Organization = styled.div``;

const Breadcrumb = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: var(--fs-base);
  border: 1px solid var(--border-primary);
  padding: 0.5em 1em;
  border-radius: 99px;
  background-color: var(--bg-primary);
  box-shadow: var(--shadow);

  ${media.phone`
    font-size: var(--fs-base);
  `}
`;

const PageTitle = styled.div`
  color: var(--text-primary);
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  > *:not(:last-of-type) {
    margin: 0 12px 0 0;
  }
`;

const BannerWrapper = styled.div`
  padding: 0px 24px;
  font-size: 0.75rem;
`;

const { publicRuntimeConfig } = getConfig();

export default function TopBar({ profileImg, userDisplayName, userHandle }) {
  const router = useRouter();
  const { header, subHeader, query, selectedTag } = useTopBarContext();
  const { setHeaders, setTag } = useTopBarActions();
  const { user } = useUserContext();

  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
        query: router.query.id,
      });
    }
  }, [user?.org]);

  const redirectToHome = () => {
    setTag(null);
    if (router.pathname !== '/') {
      router.push('/');
    }
  };

  const redirectToNew = () => {
    if (router.pathname !== '/new') {
      router.push('/new');
    }
  };

  const notNewPostPage = () => {
    return router.pathname !== '/new';
  };

  return (
    <Wrapper>
      <Constrain>
        <Breadcrumb>
          <ButtonComposite onClick={redirectToHome}>
            <Logo>flux</Logo>
            {header && (
              <>
                <ForwardSlash>/</ForwardSlash>
                <Organization>{header}</Organization>
              </>
            )}
          </ButtonComposite>
          <ForwardSlash>/</ForwardSlash>
          <PageTitle>{subHeader}</PageTitle>
          {query !== '' && (
            <>
              <ForwardSlash>/</ForwardSlash>
              <PageTitle>{query}</PageTitle>
            </>
          )}
          {selectedTag && (
            <>
              <ForwardSlash>/</ForwardSlash>
              <ButtonSquished
                onClick={() => {
                  setTag(null);
                }}
              >
                <Hashtag />
                <span>{selectedTag.toLowerCase()}</span>
              </ButtonSquished>
            </>
          )}
        </Breadcrumb>
        {publicRuntimeConfig.readOnly && (
          <BannerWrapper>
            Flux is currently in READ ONLY mode. You can view content but not
            create posts, comment, or like at this time.
          </BannerWrapper>
        )}

        <ActionsWrapper>
          {!publicRuntimeConfig.readOnly && notNewPostPage() && (
            <ButtonWireframe type="button" onClick={redirectToNew}>
              <Add />
              <span>Add Post</span>
            </ButtonWireframe>
          )}

          <Notifications />
          <UserSettings
            profileImg={profileImg}
            displayName={userDisplayName}
            userHandle={userHandle}
          />
        </ActionsWrapper>
      </Constrain>
    </Wrapper>
  );
}
