import { useEffect } from 'react';
import styled from '@emotion/styled';
import { FormControl, makeStyles, Select } from '@material-ui/core';
import { ButtonBase } from 'components/Button';
import gql from 'graphql-tag';
import { useUserContext } from 'state/user';
import { useMutation, useQuery } from 'urql';
import { useImmer } from 'use-immer';

const Wrapper = styled.div`
  width: 700px;
  padding: 32px 28px;
  background: #ffffff;
  border: 2px solid #000000;
`;

const Header = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 25px;
  border-bottom: 2px solid black;
  width: fit-content;
  margin: 0 0 38px 0;
`;
const SubHeader = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 25px;
  margin: 0 0 16px 0;
`;

const Body = styled.div`
  > div {
    &:not(:last-of-type) {
      margin: 0 0 20px 0;
    }

    > input {
      font: unset;
      cursor: pointer;
      margin: 0 0 0 38px;
      background: #ffffff;
      box-sizing: border-box;
      padding: 5px 0;
      font-size: 16px;

      &:focus {
        outline: none;
      }
    }

    ${ButtonBase} {
      border: none;
      background-color: unset;
      cursor: pointer;
      margin: 0 0 0 38px;
      background: #ffffff;
      border: 1px solid #423f3f;
      box-sizing: border-box;
      border-radius: 4px;
      padding: 5px 18px;
      font-weight: 500;
      font-size: 16px;
      line-height: 18px;
    }
  }
`;

const useStyles = makeStyles(() => ({
  formControl: {
    margin: '0 0 0 38px',
    background: '#ffffff',
    boxSizing: 'border-box',

    '& > .MuiInputBase-formControl': {
      fontFamily: 'Inconsolata',
      fontWeight: '500',
      lineHeight: '18px',
      fontSize: '18px',
    },
  },
}));

const uploadPostMutation = gql`
  mutation($file: Upload!, $userId: Int!, $lensId: Int!, $orgId: Int!) {
    postUpload(file: $file, userId: $userId, lensId: $lensId, orgId: $orgId) {
      id
    }
  }
`;

export const lensesQuery = gql`
  query {
    lenses {
      id
      name
    }
  }
`;

export default function PostUpload() {
  const classes = useStyles();
  const [file, setFile] = useImmer({ value: '' });
  const [selectedLens, setSelectedLens] = useImmer({ value: '' });
  const userContext = useUserContext();
  const [uploadPostResult, uploadPost] = useMutation(uploadPostMutation);
  const [lensesResult, runLensesQuery] = useQuery({
    query: lensesQuery,
  });

  useEffect(() => {
    if (lensesResult.data?.lenses) {
      setSelectedLens(draft => {
        draft.value = lensesResult.data?.lenses[0].id;
      });
    }
  }, [lensesResult.data?.lenses]);

  const handleSubmit = () => {
    const userId = userContext?.user?.id;
    const orgId = userContext.user?.org?.id;
    if (file.value) {
      uploadPost({
        file: file.value,
        userId,
        lensId: Number(selectedLens.value),
        orgId,
      });
    }
  };

  const handleFileUpload = e => {
    setFile(draft => {
      draft.value = e.target.files[0];
    });
  };

  const handleLensChange = e => {
    setSelectedLens(draft => {
      draft.value = e.target.value;
    });
  };

  if (uploadPostResult.data) {
    return <div>success</div>;
  }

  return (
    <Wrapper>
      <Header>Upload Markdown</Header>
      <Body>
        <div>
          <SubHeader>1. Get the template.</SubHeader>
          <ButtonBase type="button">Download</ButtonBase>
        </div>
        <div>
          <SubHeader>2. Upload.</SubHeader>
          <input type="file" accept=".md" onChange={handleFileUpload} />
        </div>
        <div>
          <SubHeader>3. Choose a Lens.</SubHeader>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              native
              value={selectedLens.value}
              onChange={handleLensChange}
            >
              {lensesResult.data?.lenses?.map(lens => (
                <option key={lens.id} value={lens.id}>
                  {lens.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <SubHeader>4. Submit.</SubHeader>
          <ButtonBase type="button" onClick={handleSubmit}>
            Submit your Post
          </ButtonBase>
        </div>
      </Body>
    </Wrapper>
  );
}
