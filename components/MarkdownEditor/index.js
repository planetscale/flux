import 'react-mde/lib/styles/css/react-mde-all.css';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { v4 as uuidv4 } from 'uuid';
import { firebaseStorage } from 'utils/auth/clientConfig';
import { useQuery } from 'urql';
import { useImmer } from 'use-immer';
import gql from 'graphql-tag';
import Editor from 'rich-markdown-editor';

const Wrapper = styled.div`
  position: relative;
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

const colors = {
  almostBlack: 'var(--background)',
  lightBlack: '#2F3336',
  almostWhite: 'var(--foreground)',
  white: 'var(--background)',
  white10: 'rgba(255, 255, 255, 0.1)',
  black: '#000',
  black10: 'rgba(0, 0, 0, 0.1)',
  primary: '#1AB6FF',
  greyLight: '#F4F7FA',
  grey: '#E8EBED',
  greyMid: '#C5CCD3',
  greyDark: '#DAE1E9',
};

const base = {
  ...colors,
  fontFamily: "'Inter',sans-serif",
  fontFamilyMono:
    "'SFMono-Regular',Consolas,'Liberation Mono', Menlo, Courier,monospace",
  fontWeight: 400,
  zIndex: 100,
  link: colors.primary,
  placeholder: '#B1BECC',
  textSecondary: '#4E5C6E',
  textLight: colors.white,
  textHighlight: 'var(--highlight)',
  selected: 'var(--highlight)',
  codeComment: '#6a737d',
  codePunctuation: '#5e6687',
  codeNumber: '#d73a49',
  codeProperty: '#c08b30',
  codeTag: '#3d8fd1',
  codeString: '#032f62',
  codeSelector: '#6679cc',
  codeAttr: '#c76b29',
  codeEntity: '#22a2c9',
  codeKeyword: '#d73a49',
  codeFunction: '#6f42c1',
  codeStatement: '#22a2c9',
  codePlaceholder: '#3d8fd1',
  codeInserted: '#202746',
  codeImportant: '#c94922',

  blockToolbarBackground: 'var(--background)',
  blockToolbarTrigger: 'var(--highlight)',
  blockToolbarTriggerIcon: 'var(--highlight)',
  blockToolbarItem: 'var(--highlight)',
  blockToolbarText: 'var(--text)',
  blockToolbarHoverBackground: 'var(--highlight)',
  blockToolbarDivider: 'var(--accent2)',

  noticeInfoBackground: '#F5BE31',
  noticeInfoText: colors.almostBlack,
  noticeTipBackground: '#9E5CF7',
  noticeTipText: colors.white,
  noticeWarningBackground: '#FF5C80',
  noticeWarningText: colors.white,
};

const lightTheme = {
  ...base,
  background: 'var(--background)',
  text: 'var(--text)',
  code: 'var(--text)',
  cursor: 'var(--text)',
  divider: 'var(--accent)',

  toolbarBackground: 'var(--background)',
  toolbarHoverBackground: 'var(--accent)',
  toolbarInput: 'var(--background)',
  toolbarItem: 'var(--text)',

  tableDivider: 'var(--accent)',
  tableSelected: 'var(--accent)',
  tableSelectedBackground: 'var(--highlight)',

  quote: 'var(--highlight)',
  codeBackground: 'var(--accent2)',
  codeBorder: 'var(--accent2)',
  horizontalRule: 'var(--accent)',
  imageErrorBackground: 'var(--accent)',

  scrollbarBackground: 'var(--accent)',
  scrollbarThumb: 'var(--accent)',
};

export default function MarkdownEditor({
  content,
  handleContentChange,
  readOnly,
}) {
  const [state, updateState] = useImmer({
    slackMemberSuggestions: [],
  });

  if (!readOnly) {
    // TODO: use client
    // const [slackMembersResult, runslackMembersQuery] = useQuery({
    //   query: slackMembersQuery,
    // });
    // useEffect(() => {
    //   if (slackMembersResult.data?.slackMembers) {
    //     updateState(draft => {
    //       draft.slackMemberSuggestions = slackMembersResult.data?.slackMembers.map(
    //         member => ({
    //           title: member.realName,
    //           subtitle: `@${member.realName}`,
    //           url: `https://flux.psdb.co/user/@${member.realName}`,
    //         })
    //       );
    //     });
    //   }
    // }, [slackMembersResult.data?.slackMembers]);
  }

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

  const valueProps = {
    defaultValue: !readOnly ? content : undefined,
    value: readOnly ? content : undefined,
  };

  return (
    <Wrapper>
      <Editor
        placeholder="Start writing!"
        uploadImage={save}
        defaultValue={content}
        onChange={handleContentChange}
        theme={lightTheme}
        readOnly={readOnly}
        onSearchLink={async term => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(
                state.slackMemberSuggestions.filter(result =>
                  result.subtitle.toLowerCase().includes(term.toLowerCase())
                )
              );
            }, 50);
          });
        }}
      />
    </Wrapper>
  );
}

MarkdownEditor.defaultProps = {
  readOnly: false,
};
