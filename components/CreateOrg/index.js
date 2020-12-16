import styled from '@emotion/styled';
import Input from 'components/Input';
import gql from 'graphql-tag';
import { useClient, useMutation } from 'urql';
import { useImmer } from 'use-immer';
import debounce from 'lodash/debounce';
import { useCallback, useEffect } from 'react';

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
`;

const orgQuery = gql`
  query($name: String!) {
    org(where: { name: $name }) {
      name
    }
  }
`;

const createOrgMutation = gql`
  mutation($name: String!, $createdAt: String!) {
    createOneOrg(name: $name, createdAt: $createAt) {
      name
      createdAt
    }
  }
`;

const getOrg = async (urqlClinet, { name }) => {
  return urqlClinet
    .query(orgQuery, {
      name,
    })
    .toPromise();
};

export default function CreateOrg({ name }) {
  const client = useClient();
  const [state, setState] = useImmer({
    orgName: '',
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
  const [createOrgResult, createOrg] = useMutation(createOrgMutation);

  useEffect(() => {
    debouncedOrgNameCheck(state.orgName);
  }, [state.orgName]);

  const checkOrgExistence = orgName => {
    getOrg(client, { name: orgName })
      .then(res => {
        setState(draft => {
          draft.isOrgExisted = !!res?.data?.org;
        });
      })
      .catch(e => {
        console.error(e);
      });
  };

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

  const handleNextClick = e => {
    e.preventDefault();
  };

  return (
    <Wrapper>
      <div>
        <InputWrapper>
          <Input label="Organization Name" onChange={handleOrgNameChange} />
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
            onClick={handleNextClick}
            disabled={state.isOrgExisted}
          >
            Next
          </Button>
        </ButtonWrapper>
      </div>
    </Wrapper>
  );
}
