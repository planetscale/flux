import styled from '@emotion/styled';
import Modal from '@material-ui/core/Modal';
import { ButtonImage, ButtonMajor, ButtonLink } from 'components/Button';
import UserIcon from '../UserIcon';
import UserSettings from 'components/UserSettings';
import { useState, useEffect } from 'react';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useRouter } from 'next/router';
import { useUserContext } from 'state/user';
import { media } from '../../pageUtils/post/theme';

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
      background: linear-gradient(90deg, #353e58 0%, #c56a86 138.77%), #000000;
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

  ${ButtonMajor} {
    margin: 0 12px 0 0;
  }
`;

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const USER_SETTINGS = 'user settings';

export default function TopBar({ profileImg, userDisplayName, userHandle }) {
  const router = useRouter();
  const [isOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const { header, subHeader } = useTopBarContext();
  const { setHeaders } = useTopBarActions();
  const { user } = useUserContext();

  useEffect(() => {
    if (user?.org?.name) {
      setHeaders({
        header: user?.org.name,
      });
    }
  }, [user?.org]);

  const handleModalOpen = content => {
    setModalOpen(true);
    setModalContent(content);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

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
        <StyledModal
          open={isOpen}
          onClose={handleModalClose}
          aria-labelledby={modalContent}
          aria-describedby={modalContent}
        >
          <>
            {modalContent === USER_SETTINGS && (
              <UserSettings
                profileImg={profileImg}
                displayName={userDisplayName}
                userHandle={userHandle}
              />
            )}
          </>
        </StyledModal>

        {notNewPostPage() && (
          <ButtonMajor type="button" onClick={redirectToNew}>
            <img src="/icon_plus.svg" alt="Button to add update" />
            <span>Add Update</span>
          </ButtonMajor>
        )}

        <ButtonImage
          type="button"
          onClick={() => {
            handleModalOpen(USER_SETTINGS);
          }}
        >
          <UserIcon src={profileImg} alt="Image of user" />
        </ButtonImage>
      </ActionsWrapper>
    </Wrapper>
  );
}
