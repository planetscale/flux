import styled from '@emotion/styled';
import { ButtonImage, ButtonSpecial, ButtonLink } from 'components/Button';
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
    flex-direction: column;
    padding: 0;
  `}

  > div:first-of-type {
    font-size: 24px;
    line-height: 38px;

    > div {
      display: flex;
      display: inline-block;
      padding: 0 10px 0 0;
      position: relative;
      height: 38px;
      text-transform: capitalize;

      &:first-of-type {
        ${ButtonLink} {
          font-family: 'Raleway', sans-serif;
          text-transform: uppercase;
          font-style: italic;
          font-weight: 900;
          font-size: 24px;
        }
      }
    }
  }
`;

const SlasherFlick = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${media.phone`
    padding: 30px;
  `}

  > ${ButtonLink} {
    font-size: 24px;
    margin-right: 8px;
    border-radius: unset;
    padding: 0 4px;

    &:first-of-type {
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
    }
  }
`;

const ForwardSlash = styled.div`
  color: var(--accent);
`;

const SubHeader = styled.div`
  color: var(--text);
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  ${media.phone`
    padding: 30px;
    border-top: 1px solid var(--accent2);
  `}

  ${ButtonSpecial} {
    margin: 0 12px 0 0;
  }
`;

export default function TopBar({ profileImg, userDisplayName, userHandle }) {
  const router = useRouter();
  const { header, subHeader } = useTopBarContext();
  const { setHeaders, fetchTags } = useTopBarActions();
  const { user } = useUserContext();

  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
      });
      fetchTags();
    }
  }, [user?.org]);

  const redirectToHome = () => {
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
      <SlasherFlick>
        <ButtonLink onClick={redirectToHome}>flux</ButtonLink>
        <ForwardSlash>/</ForwardSlash>
        <ButtonLink onClick={redirectToHome}>{header}</ButtonLink>
        <ForwardSlash>/</ForwardSlash>
        <SubHeader>{subHeader}</SubHeader>
      </SlasherFlick>
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
          <UserSettings
            profileImg={profileImg}
            displayName={userDisplayName}
            userHandle={userHandle}
          />
        </DropdownMenu.Root>
      </ActionsWrapper>
    </Wrapper>
  );
}
