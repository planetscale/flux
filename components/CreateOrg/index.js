import { useState } from 'react';
import styled from '@emotion/styled';
import { InputWrapper } from 'pageUtils/post/styles';
import Input from 'components/Input';
import { useImmer } from 'use-immer';
import { useRouter } from 'next/router';
import { ButtonWireframe } from 'components/Button';
import { useUserActions } from 'state/user';

const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;

  .profile-header {
    padding: 1em 0;
    font-weight: bold;
    font-size: var(--fs-base-plus-2);
  }
`;

export default function CreateOrg({ name, avatar }) {
  const router = useRouter();
  const { createUser } = useUserActions();
  const [state, setState] = useImmer({
    // TODO: Allow first user to set an organization name for the instance
    orgName: '',
    userName: '',
    name: name ? name : '',
  });

  const [userNameInputState, setUserNameInputState] = useImmer({
    userName: '',
    isInvalid: false,
    error: '',
  });

  const handleNameChange = e => {
    let target = e.target;
    let targetWrapper = target.parentNode.parentNode;

    setState(draft => {
      draft.name = e.target.value;
    });

    if (target.value.length > 0) {
      targetWrapper.classList.remove('error');
    } else {
      targetWrapper.classList.add('error');
    }
  };

  const handleUserNameChange = e => {
    let target = e.target;

    setUserNameInputState(draft => {
      draft.userName = e.target.value;
      draft.error = '';
    });

    if (target.value.length > 0) {
      setUserNameInputState(draft => {
        draft.isInvalid = false;
      });
    } else {
      setUserNameInputState(draft => {
        draft.isInvalid = true;
      });
    }
  };

  const handleSubmission = async e => {
    e.preventDefault();

    if (!(userNameInputState.userName?.trim() && state.name?.trim())) {
      return;
    }

    try {
      await createUser({
        userName: userNameInputState.userName,
        displayName: state.name,
        orgName: state.orgName,
        avatar,
        bio: '',
      });

      router.push('/');
    } catch (error) {
      setUserNameInputState(draft => {
        draft.isInvalid = true;
        draft.error = error.message;
      });
    }
  };

  const onInputWrapperClick = e => {
    e.preventDefault();
    e.currentTarget.getElementsByTagName('input')[0].focus();
  };

  const onFocusLost = e => {
    e.preventDefault();
    const inputElement = e.currentTarget.getElementsByTagName('input')[0];
    if (inputElement.value.length === 0) {
      e.currentTarget.classList.add('error');
    }
  };

  return (
    <Wrapper>
      <div className="profile-header">Create user profile</div>
      {/* {state.orgName && (
        <InputWrapper onClick={onInputWrapperClick} onBlur={onFocusLost}>
          <Input
            label="Organization name"
            value={state.orgName}
            onChange={handleUserNameChange}
          />
        </InputWrapper>
      )} */}
      <InputWrapper
        className={userNameInputState.isInvalid ? 'error' : null}
        onClick={onInputWrapperClick}
        onBlur={onFocusLost}
      >
        <Input
          label="Your username"
          value={userNameInputState.userName}
          onChange={handleUserNameChange}
          helperText={userNameInputState.error}
        />
      </InputWrapper>
      <InputWrapper onClick={onInputWrapperClick} onBlur={onFocusLost}>
        <Input
          label="Your name"
          value={state.name}
          onChange={handleNameChange}
        />
      </InputWrapper>

      <ButtonWireframe
        type="submit"
        onClick={
          state.name && userNameInputState.userName ? handleSubmission : null
        }
        disabled={!(state.name && userNameInputState.userName)}
      >
        Next
      </ButtonWireframe>
    </Wrapper>
  );
}
