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
import gfm from 'remark-gfm';
import Editor from 'rich-markdown-editor';

const Wrapper = styled.div`
  width: 100%;

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

  const save = async function (data) {
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
    return imgUrl;
  };

  return (
    <Wrapper>
      <Editor
        placeholder="Start writing!"
        uploadImage={save}
        defaultValue={content}
        onChange={handleContentChange}
      />
    </Wrapper>
  );
}
