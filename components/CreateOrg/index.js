import styled from '@emotion/styled';
import { media } from 'pageUtils/post/theme';
import Input from 'components/Input';
import gql from 'graphql-tag';
import { useClient, useMutation } from 'urql';
import { useImmer } from 'use-immer';
import debounce from 'lodash/debounce';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthActions } from 'state/auth';
import { ButtonMinor } from 'components/Button';

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
  background-color: var(--background);
  color: var(--text);
  border-bottom: 1px solid var(--accent2);
  padding: 32px;

  input {
    background-color: unset;
    color: var(--text);
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

const orgQuery = gql`
  query($name: String!) {
    org(where: { name: $name }) {
      name
    }
  }
`;

const createUserWithOrgMutation = gql`
  mutation(
    $email: String!
    $userName: String!
    $displayName: String!
    $orgName: String!
    $avatar: String!
    $bio: String!
  ) {
    createOneUser(
      data: {
        email: $email
        username: $userName
        displayName: $displayName
        profile: { create: { bio: $bio, avatar: $avatar } }
        org: {
          connectOrCreate: {
            where: { name: $orgName }
            create: { name: $orgName }
          }
        }
      }
    ) {
      email
    }
  }
`;

const getOrg = async (urqlClient, { name }) => {
  return urqlClient
    .query(orgQuery, {
      name,
    })
    .toPromise();
};

const getOrgNameFromEmailDomain = email => {
  return email?.split('@').pop().split('.')[0] ?? '';
};

export default function CreateOrg({ name, email, avatar }) {
  const router = useRouter();
  const client = useClient();
  const { userLogout } = useAuthActions();
  const [state, setState] = useImmer({
    orgName: getOrgNameFromEmailDomain(email),
    userName: '',
    name: name ? name : '',
    isOrgExisted: false,
  });
  const debouncedOrgNameCheck = useCallback(
    debounce(checkOrgExistence, 300, {
      leading: true,
      trailing: true,
    }),
    []
  );
  const [createOrgResult, createUserWithOrg] = useMutation(
    createUserWithOrgMutation
  );

  useEffect(() => {
    debouncedOrgNameCheck(state.orgName);
  }, [state.orgName]);

  // lodash debounce need normal func to work, it doesn't work with arrow func
  function checkOrgExistence(orgName) {
    getOrg(client, { name: orgName })
      .then(res => {
        setState(draft => {
          draft.isOrgExisted = !!res?.data?.org;
        });
      })
      .catch(e => {
        console.error(e);
      });
  }

  const handleOrgNameChange = e => {
    setState(draft => {
      draft.orgName = e.target.value;
    });
  };

  const handleNameChange = e => {
    setState(draft => {
      draft.name = e.target.value;
    });
  };

  const handleUserNameChange = e => {
    setState(draft => {
      draft.userName = e.target.value;
    });
  };

  const handleNextClick = e => {
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

    createUserWithOrg({
      email,
      userName: state.userName,
      displayName: state.name,
      orgName: state.orgName,
      avatar,
      bio: '',
    })
      .then(res => {
        if (res.data) {
          router.push('/');
        } else if (res.error) {
          console.error(e);
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  const onInputWrapperClick = e => {
    e.preventDefault();
    e.currentTarget.getElementsByTagName('input')[0].focus();
  };

  return (
    <Wrapper>
      <InputWrapper className="disabled">
        <Input
          label="Organization Name"
          value={state.orgName}
          onChange={handleOrgNameChange}
          disabled
        />
      </InputWrapper>
      <InputWrapper onClick={onInputWrapperClick}>
        <Input
          label="Your Username"
          value={state.userName}
          onChange={handleUserNameChange}
        />
      </InputWrapper>
      <InputWrapper onClick={onInputWrapperClick}>
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
