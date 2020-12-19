import styled from '@emotion/styled';
import Modal from '@material-ui/core/Modal';
import { ButtonBase } from 'components/Button';
import UserIcon from '../UserIcon';
import Logout from './Logout';
import UserSettings from 'components/UserSettings';
import { useState } from 'react';
import PostUpload from 'components/PostUpload';
import { useTopBarContext } from 'state/topBar';

const Wrapper = styled.div`
  width: 100%;
  height: 138px;
  border-bottom: 2px solid #000000;
  display: flex;
  justify-content: space-between;

  > div:first-of-type {
    display: flex;
    flex-direction: column;

    font-size: 36px;
    line-height: 38px;
    color: #000000;
    margin: 24px 0 0 48px;

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
  height: 60px;
  align-items: center;
  margin: 18px 14px 0 0;

  button:first-of-type {
    margin: 0 12px 0 0;
  }
`;

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UPLOAD_MARKDOWN = 'upload markdown';
const USER_SETTINGS = 'user settings';

export default function TopBar({ profileImg, userDisplayName, userHandle }) {
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

  return (
    <Wrapper>
      <div>
        {header}
        <span>{subHeader}</span>
      </div>
      <ActionsWrapper>
        <StyledModal
          open={isOpen}
          onClose={handleModalClose}
          aria-labelledby={modalContent}
          aria-describedby={modalContent}
        >
          <>
            {modalContent === UPLOAD_MARKDOWN && <PostUpload />}

            {modalContent === USER_SETTINGS && (
              <UserSettings
                profileImg={profileImg}
                displayName={userDisplayName}
                userHandle={userHandle}
              />
            )}
          </>
        </StyledModal>

        <ButtonBase
          type="button"
          onClick={() => {
            handleModalOpen(UPLOAD_MARKDOWN);
          }}
        >
          <img src="/upload.svg" alt="upload post" width="26px" height="26px" />
        </ButtonBase>

        <ButtonBase
          type="button"
          onClick={() => {
            handleModalOpen(USER_SETTINGS);
          }}
        >
          <UserIcon
            src={profileImg}
            width="60px"
            height="60px"
            alt="user avatar"
          />
        </ButtonBase>
      </ActionsWrapper>

      <Logout />
    </Wrapper>
  );
}
