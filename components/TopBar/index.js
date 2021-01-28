import styled from '@emotion/styled';
import {
  ButtonImage,
  ButtonSpecial,
  ButtonLink,
  ButtonTag,
} from 'components/Button';
import UserIcon from '../UserIcon';
import UserSettings from 'components/UserSettings';
import { useEffect } from 'react';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useRouter } from 'next/router';
import { useUserContext } from 'state/user';
import { Icon } from 'pageUtils/post/atoms';
import { media } from '../../pageUtils/post/theme';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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

  ${media.phone`
    align-items: stretch;
    padding: 1em;
  `}
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${media.phone`
    flex-direction: column;
    align-items: flex-start;

  `}
`;

const Logo = styled(ButtonLink)`
  font-size: 24px;
  margin-right: 8px;
  border-radius: unset;
  padding: 0 4px;
  font-family: 'Raleway', sans-serif;
  text-transform: uppercase;
  font-style: italic;
  font-weight: 900;
  background: linear-gradient(90deg, #5b71b3 0%, #c56a86 138.77%), #000000;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;

  ${media.phone`
    font-size: 1em;
    margin-bottom: 0.5em;
  `}
`;

const ForwardSlash = styled.div`
  color: var(--accent);
`;

const Breadcrumb = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 24px;

  > ${ForwardSlash} {
    margin: 0 0.5em;
  }

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

  ${ButtonSpecial} {
    margin: 0 12px 0 0;
  }
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
      <BreadcrumbContainer>
        <Logo onClick={redirectToHome}>flux</Logo>
        <Breadcrumb>
          <ForwardSlash>/</ForwardSlash>
          <ButtonLink onClick={redirectToHome}>{header}</ButtonLink>
          <ForwardSlash>/</ForwardSlash>
          <PageTitle>{subHeader}</PageTitle>
          {query !== '' && (
            <>
              <ForwardSlash>/</ForwardSlash>
              <PageTitle>{query}</PageTitle>
            </>
          )}
        </Breadcrumb>

        {selectedTag && (
          <ButtonTag
            onClick={() => {
              setTag(null);
            }}
          >
            <span>#{selectedTag.toLowerCase()}</span>
          </ButtonTag>
        )}
      </BreadcrumbContainer>
      <ActionsWrapper>
        {notNewPostPage() && (
          <ButtonSpecial type="button" onClick={redirectToNew}>
            <Icon className="icon-plus"></Icon>
            <span>Add Update</span>
          </ButtonSpecial>
        )}

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
