import styled from '@emotion/styled';
import {
  ButtonImage,
  ButtonSpecial,
  ButtonLink,
  ButtonTag,
  ButtonComposite,
} from 'components/Button';
import UserIcon from '../UserIcon';
import UserSettings from 'components/UserSettings';
import { useEffect } from 'react';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useRouter } from 'next/router';
import { useUserContext } from 'state/user';
import { Icon } from 'pageUtils/post/atoms';
import { media } from '../../pageUtils/post/theme';
import * as DropdownMenu from 'components/DropdownMenu';
import Notifications from 'components/Notifications';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  border-bottom: 1px solid var(--accent2);
  padding: 30px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--background);
  opacity: 0.95;

  ${media.phone`
    flex-direction: column;
    align-items: stretch;
    padding: 1em;
  `}
`;

const Logo = styled.div`
  letter-spacing: -1px;
  font-size: 24px;
  border-radius: unset;
  padding: 0 8px;
  font-family: 'Raleway', sans-serif;
  font-feature-settings: 'liga';
  font-style: italic;
  font-weight: 900;
  background: linear-gradient(90deg, var(--highlight2), var(--highlight)),
    var(--text);
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
  font-size: 24px;

  > ${ButtonLink} {
    border-radius: unset;
    padding: 0 4px;
    font-size: 24px;
  }

  ${media.phone`
    font-size: 1em;

    > ${ForwardSlash}:first-of-type {
      margin-left: 0;
    }

    > ${ButtonLink} {
      font-size: 1em;
    }
  `}
`;

const PageTitle = styled.div`
  color: var(--text);
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
    border-top: 1px solid var(--accent2);
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
      <Breadcrumb>
        <ButtonComposite onClick={redirectToHome}>
          <Logo>flux</Logo>
          <ForwardSlash>/</ForwardSlash>
          <Organization>{header}</Organization>
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
            <ButtonTag
              onClick={() => {
                setTag(null);
              }}
            >
              <span>#{selectedTag.toLowerCase()}</span>
            </ButtonTag>
          </>
        )}
      </Breadcrumb>
      <ActionsWrapper>
        {notNewPostPage() && (
          <ButtonSpecial type="button" onClick={redirectToNew}>
            <Icon className="icon-plus"></Icon>
            <span>Add Update</span>
          </ButtonSpecial>
        )}

        <Notifications />

        <DropdownMenu.Root>
          <ButtonImage as={DropdownMenu.Trigger}>
            <UserIcon src={profileImg} alt="Image of user" />
          </ButtonImage>
          <UserSettings displayName={userDisplayName} userHandle={userHandle} />
        </DropdownMenu.Root>
      </ActionsWrapper>
    </Wrapper>
  );
}
