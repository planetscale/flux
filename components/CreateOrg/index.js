import styled from '@emotion/styled';
import { media } from 'pageUtils/post/theme';
import Input from 'components/Input';
import { useImmer } from 'use-immer';
import { useRouter } from 'next/router';
import { ButtonWireframe } from 'components/Button';
import { useUserActions } from 'state/user';

const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;
  height: fit-content;
  border-radius: 4px;
  box-shadow: var(--shadow);
  background-color: var(--bg-primary);

  ${media.phone`
    border-radius: 0;
  `}

  .profile-header {
    padding: 32px;
    font-weight: bold;
    font-size: 2rem;
  }
`;

const FormLabel = styled.div`
  padding: 2em;
  border-bottom: 1px solid var(--accent2);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  flex-direction: column;
  color: var(--accent);
`;

const FormLabelIdentifier = styled.div`
  margin-bottom: 0.5em;
`;

const FormLabelOrganization = styled.div`
  font-weight: 900;
`;

const InputWrapper = styled.div`
  position: relative;
  color: var(--text-primary);
  border-bottom: 1px solid var(--accent2);
  padding: 32px;

  input {
    background-color: unset;
    color: var(--text-primary);
    border-bottom: 1px solid var(--bg-primary);
  }

  &:hover {
    cursor: pointer;
    background-color: var(--accent2);

    input {
      background-color: var(--accent2);
    }
  }

  &.disabled {
    cursor: default;
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);

    input {
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0);
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);

      input {
        background-color: rgba(255, 255, 255, 0);
      }
    }

    ${media.phone`
      border-radius: 0;
    `}
  }

  &.error {
    input {
      border-bottom: 1px solid red;
    }
  }
`;

const ButtonWrapper = styled.div`
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 32px;

  ${media.phone`
    border-radius: 0;
  `}
`;

export default function CreateOrg({ name, email, avatar }) {
  const router = useRouter();
  const { createUser } = useUserActions();
  const [state, setState] = useImmer({
    // TODO: Allow first user to set an organization name for the instance
    orgName: '',
    userName: '',
    name: name ? name : '',
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
    let targetWrapper = target.parentNode.parentNode;

    setState(draft => {
      draft.userName = e.target.value;
    });

    if (target.value.length > 0) {
      targetWrapper.classList.remove('error');
    } else {
      targetWrapper.classList.add('error');
    }
  };

  const handleNextClick = async e => {
    e.preventDefault();

    if (!(state.userName?.trim() && state.name?.trim())) {
      return;
    }

    try {
      await createUser({
        userName: state.userName,
        displayName: state.name,
        orgName: state.orgName,
        avatar,
        bio: '',
      });
      router.push('/');
    } catch (e) {
      console.error(e);
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
      <div className="profile-header">User Profile</div>
      {state.orgName && (
        <FormLabel>
          <FormLabelIdentifier>Create Account In</FormLabelIdentifier>
          <FormLabelOrganization>{state.orgName}</FormLabelOrganization>
        </FormLabel>
      )}
      <InputWrapper onClick={onInputWrapperClick} onBlur={onFocusLost}>
        <Input
          label="Your Username"
          value={state.userName}
          onChange={handleUserNameChange}
        />
      </InputWrapper>
      <InputWrapper onClick={onInputWrapperClick} onBlur={onFocusLost}>
        <Input
          label="Your Name"
          value={state.name}
          onChange={handleNameChange}
        />
      </InputWrapper>
      <ButtonWrapper>
        <ButtonWireframe
          type="submit"
          onClick={state.name && state.userName ? handleNextClick : null}
          disabled={!(state.name && state.userName)}
        >
          Next
        </ButtonWireframe>
      </ButtonWrapper>
    </Wrapper>
  );
}
