import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { v4 as uuidv4 } from 'uuid';
import { firebaseStorage } from 'utils/auth/clientConfig';
import CodeBlock from './CodeBlock';
import { useQuery } from 'urql';
import { useImmer } from 'use-immer';
import gql from 'graphql-tag';

const Wrapper = styled.div`
  textarea {
    :focus {
      outline: none;
    }
  }
  .mde-suggestions {
    overflow-y: auto;
    max-height: 150px;
    z-index: 1;
  }
`;

const slackMembersQuery = gql`
  query {
    slackMembers {
      id
      realName
      displayName
    }
  }
`;

const TABS = {
  WRITE: 'write',
  PREVIWE: 'preview',
};

export default function MarkdownEditor({ content, handleContentChange }) {
  const [selectedTab, setSelectedTab] = useState(TABS.WRITE);
  const [state, updateState] = useImmer({
    slackMemberSuggestions: [],
  });

  const [slackMembersResult, runslackMembersQuery] = useQuery({
    query: slackMembersQuery,
  });

  useEffect(() => {
    if (slackMembersResult.data?.slackMembers) {
      updateState(draft => {
        draft.slackMemberSuggestions = slackMembersResult.data?.slackMembers.map(
          member => ({
            preview: member.realName,
            value: `@${member.realName}`,
          })
        );
      });
    }
  }, [slackMembersResult.data?.slackMembers]);

  const loadSuggestions = text => {
    return new Promise((accept, reject) => {
      setTimeout(() => {
        const suggestions = state.slackMemberSuggestions.filter(i =>
          i.preview.toLowerCase().includes(text.toLowerCase())
        );
        accept(suggestions);
      }, 50);
    });
  };

  const save = async function* (data) {
    const storagePath = firebaseStorage.ref().child(`/img/${uuidv4()}.jpg`);

    try {
      await storagePath.put(data);
    } catch (error) {
      console.error(error);
      // TODO: handle errors
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }

    let imgUrl = '';
    try {
      imgUrl = await storagePath.getDownloadURL();
    } catch (error) {
      console.error(error);
      // TODO: handle errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    }

    if (imgUrl) {
      // yields the URL that should be inserted in the markdown
      yield imgUrl;
      // returns true meaning that the save was successful
      return true;
    }

    // returns false meaning that the save was failed
    return false;
  };

  return (
    <Wrapper>
      <ReactMde
        value={content}
        onChange={handleContentChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={markdown =>
          Promise.resolve(
            <ReactMarkdown source={markdown} renderers={{ code: CodeBlock }} />
          )
        }
        loadSuggestions={loadSuggestions}
        suggestionTriggerCharacters={['@']}
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
        paste={{
          saveImage: save,
        }}
      />
    </Wrapper>
  );
}
