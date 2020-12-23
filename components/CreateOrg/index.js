import styled from '@emotion/styled';
import Input from 'components/Input';
import gql from 'graphql-tag';
import { useClient, useMutation } from 'urql';
import { useImmer } from 'use-immer';
import debounce from 'lodash/debounce';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  padding: 24px;
  width: 616px;
  height: fit-content;
  background: #ffffff;
  border: 2px solid #000000;

  > div {
    width: 100%;
    height: fit-content;
    border: 1px solid #000000;
  }
`;

const InputWrapper = styled.div`
  border-bottom: 1px solid #e1e1e1;
  padding: 16px;
`;

const ButtonWrapper = styled.div`
  padding: 16px;
`;

const Button = styled.button`
  width: 71px;
  height: 48px;
  background: #ffffff;
  border: 2px solid #000000;
  cursor: pointer;

  :focus {
    outline: unset;
  }

  :disabled {
    cursor: unset;
    color: #e0e0e0;
    border: 2px solid #e0e0e0;
  }
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
  ) {
    createOneUser(
      data: {
        email: $email
        username: $userName
        displayName: $displayName
        org: { create: { name: $orgName } }
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

export default function CreateOrg({ name, email }) {
  const router = useRouter();
  const client = useClient();
  const [state, setState] = useImmer({
    orgName: '',
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
    createUserWithOrg({
      email,
      userName: state.userName,
      displayName: state.name,
      orgName: state.orgName,
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

  return (
    <Wrapper>
      <div>
        <InputWrapper>
          <Input label="Organization Name" onChange={handleOrgNameChange} />
        </InputWrapper>
        <InputWrapper>
          <Input
            label="Your Username"
            value={state.userName}
            onChange={handleUserNameChange}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            label="Your Name"
            value={state.name}
            onChange={handleNameChange}
          />
        </InputWrapper>
        <ButtonWrapper>
          <Button
            type="submit"
            onClick={
              state.orgName && state.name && state.userName
                ? handleNextClick
                : null
            }
            disabled={!(state.orgName && state.name && state.userName)}
          >
            Next
          </Button>
        </ButtonWrapper>
      </div>
    </Wrapper>
  );
}
