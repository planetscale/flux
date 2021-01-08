import styled from '@emotion/styled';
import Modal from '@material-ui/core/Modal';
import { ButtonImage, ButtonMajor, ButtonLink } from 'components/Button';
import UserIcon from '../UserIcon';
import UserSettings from 'components/UserSettings';
import { useState } from 'react';
import { useTopBarContext } from 'state/topBar';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  border-bottom: 1px solid #eee;
  padding: 30px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;

  > div:first-of-type {
    font-size: 24px;
    line-height: 28px;
    color: #000000;

    > div {
      display: flex;
      display: inline-block;
      padding: 0 10px 0 0;
      position: relative;
      height: 29px;
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

      &:nth-of-type(even) {
        color: #e1e1e1;
      }
    }

    span {
      width: fit-content;
      display: inline-block;
      font-size: 24px;
      line-height: 25px;
      border-bottom: 2px solid black;
      margin: 20px 0 0 0;
    }
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;

  button:first-of-type {
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
  return (
    <Wrapper>
      <div>
        <div>
          <ButtonLink onClick={redirectToHome}>flux</ButtonLink>
        </div>
        <div>/</div>
        <div>{header}</div>
        <div>/</div>
        <div>{subHeader}</div>
      </div>
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

        <ButtonMajor type="button" onClick={redirectToNew}>
          <img src="/icon_plus.svg" alt="Button to add update" />
          <span>Add Update</span>
        </ButtonMajor>

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
