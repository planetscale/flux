import styled from '@emotion/styled';
import {
  ButtonImage,
  ButtonWireframe,
  ButtonSquished,
  ButtonComposite,
} from 'components/Button';
import UserIcon from '../UserIcon';
import UserSettings from 'components/UserSettings';
import { useEffect } from 'react';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useRouter } from 'next/router';
import { useUserContext } from 'state/user';
import { Add } from '@styled-icons/remix-line';
import { media } from '../../pageUtils/post/theme';
import * as DropdownMenu from 'components/DropdownMenu';
import Notifications from 'components/Notifications';

const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 1px solid var(--border-primary);
  padding: 30px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--bg-primary);
`;

const Constrain = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 80rem;
`;

const Logo = styled.div`
  letter-spacing: -1px;
  font-size: 1em;
  border-radius: unset;
  padding: 0 8px;
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
    font-size: 1em;
  `}
`;

const ForwardSlash = styled.div`
  color: var(--accent);
  margin: 0 0.5em;
`;

const Organization = styled.div``;

const Breadcrumb = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1em;
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

  ${media.phone`
    border-top: 1px solid var(--border-primary);
    margin-top: 1em;
    padding-top: 1em;
  `}
`;

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
                <span>#{selectedTag.toLowerCase()}</span>
              </ButtonSquished>
            </>
          )}
        </Breadcrumb>
        <ActionsWrapper>
          {notNewPostPage() && (
            <ButtonWireframe type="button" onClick={redirectToNew}>
              <Add />
              <span>Add Post</span>
            </ButtonWireframe>
          )}

          <Notifications />

          <DropdownMenu.Root>
            <ButtonImage as={DropdownMenu.Trigger}>
              <UserIcon src={profileImg} alt="Image of user" />
            </ButtonImage>
            <UserSettings
              displayName={userDisplayName}
              userHandle={userHandle}
            />
          </DropdownMenu.Root>
        </ActionsWrapper>
      </Constrain>
    </Wrapper>
  );
}
