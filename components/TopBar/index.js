import styled from '@emotion/styled';
import Modal from '@material-ui/core/Modal';
import { ButtonBase } from 'components/Button';
import UserIcon from '../UserIcon';
import UserSettings from 'components/UserSettings';
import { useState } from 'react';
import PostUpload from 'components/PostUpload';
import { useTopBarActions, useTopBarContext } from 'state/topBar';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  width: 100%;
  height: 95px;
  border-bottom: 1px solid #000000;
  display: flex;
  justify-content: space-between;
  padding: 30px;
  box-sizing: border-box;

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
        ${ButtonBase} {
          text-transform: uppercase;
          font-style: italic;
          font-weight: 900;
          font-family: 'Raleway', sans-serif;
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

const AddUpdateButton = styled(ButtonBase)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 34px;
  background: #000000;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  border-radius: 99px;
  color: #ffffff;

  img {
    width: 12px;
    height: auto;
    margin: 0 13.75px 0 0;
  }
`;

const UPLOAD_MARKDOWN = 'upload markdown';
const USER_SETTINGS = 'user settings';

export default function TopBar({ profileImg, userDisplayName, userHandle }) {
  const router = useRouter();
  const [isOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const { header, subHeader } = useTopBarContext();
  const { setHeaders } = useTopBarActions();
  const handleModalOpen = content => {
    setModalOpen(true);
    setModalContent(content);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const redirectToHome = () => {
    setHeaders({
      subHeader: 'all',
    });
    if (router.pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <Wrapper>
      <div>
        <div>
          <ButtonBase onClick={redirectToHome}>flux</ButtonBase>
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
            {modalContent === UPLOAD_MARKDOWN && (
              <PostUpload closeModal={handleModalClose} />
            )}

            {modalContent === USER_SETTINGS && (
              <UserSettings
                profileImg={profileImg}
                displayName={userDisplayName}
                userHandle={userHandle}
              />
            )}
          </>
        </StyledModal>

        <AddUpdateButton
          type="button"
          onClick={() => {
            handleModalOpen(UPLOAD_MARKDOWN);
          }}
        >
          <img src="/plus.svg" alt="upload post" width="26px" height="26px" />
          <span>Add Update</span>
        </AddUpdateButton>

        <ButtonBase
          type="button"
          onClick={() => {
            handleModalOpen(USER_SETTINGS);
          }}
        >
          <UserIcon
            src={profileImg}
            width="34px"
            height="34px"
            alt="user avatar"
          />
        </ButtonBase>
      </ActionsWrapper>
    </Wrapper>
  );
}
