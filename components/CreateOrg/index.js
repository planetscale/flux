import styled from '@emotion/styled';
import { media } from 'pageUtils/post/theme';
import Input from 'components/Input';
import { useClient } from 'urql';
import { useImmer } from 'use-immer';
import { useRouter } from 'next/router';
import { useAuthActions } from 'state/auth';
import { ButtonMinor } from 'components/Button';
import { useUserActions } from 'state/user';

const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;
  height: fit-content;
  border-radius: 4px;
  box-shadow: var(--shadow);

  ${media.phone`
    border-radius: 0;
  `}
`;

const InputWrapper = styled.div`
  position: relative;
  background-color: var(--background);
  color: var(--text);
  border-bottom: 1px solid var(--accent2);
  padding: 32px;

  input {
    background-color: unset;
    color: var(--text);
    border-bottom: 1px solid var(--background);
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
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
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
  background-color: var(--background);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 32px;

  ${media.phone`
    border-radius: 0;
  `}
`;

const getOrgNameFromEmailDomain = email => {
  return email?.split('@').pop().split('.')[0] ?? '';
};

export default function CreateOrg({ name, email, avatar }) {
  const router = useRouter();
  const client = useClient();
  const { userLogout } = useAuthActions();
  const { createUser } = useUserActions();
  const [state, setState] = useImmer({
    orgName: getOrgNameFromEmailDomain(email),
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

    if (
      !(state.userName?.trim() && state.name?.trim() && state.orgName?.trim())
    ) {
      return;
    }

    // TODO: better handle org name different from email domain.
    if (state.orgName.trim() !== getOrgNameFromEmailDomain(email)) {
      userLogout();
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
      <InputWrapper className="disabled">
        <Input label="Organization Name" value={state.orgName} disabled />
      </InputWrapper>
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
        <ButtonMinor
          type="submit"
          onClick={
            state.orgName && state.name && state.userName
              ? handleNextClick
              : null
          }
          disabled={!(state.orgName && state.name && state.userName)}
        >
          Next
        </ButtonMinor>
      </ButtonWrapper>
    </Wrapper>
  );
}
