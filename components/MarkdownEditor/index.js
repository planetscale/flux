import styled from '@emotion/styled';
import Editor from 'rich-markdown-editor';
import imageCompression from 'browser-image-compression';
import getPlugins from './plugins';

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  textarea {
    :focus {
      outline: none;
    }
  }
`;

const colors = {
  almostBlack: 'var(--bg-primary)',
  lightBlack: '#2F3336',
  almostWhite: 'var(--text-primary)',
  white: 'var(--bg-primary)',
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
  placeholder: 'var(--border-secondary)',
  textSecondary: '#4E5C6E',
  textLight: colors.white,
  textHighlight: 'var(--text-blue)',
  selected: 'var(--text-blue)',
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

  blockToolbarBackground: 'var(--bg-primary)',
  blockToolbarTrigger: 'var(--text-blue)',
  blockToolbarTriggerIcon: 'var(--text-blue)',
  blockToolbarItem: 'var(--text-primary)',
  blockToolbarText: 'var(--text-primary)',
  blockToolbarHoverBackground: 'var(--text-blue)',
  blockToolbarDivider: 'var(--border-secondary)',

  noticeInfoBackground: '#F5BE31',
  noticeInfoText: colors.almostBlack,
  noticeTipBackground: '#9E5CF7',
  noticeTipText: colors.white,
  noticeWarningBackground: '#FF5C80',
  noticeWarningText: colors.white,
};

const lightTheme = {
  ...base,
  background: 'unset',
  text: 'var(--text-primary)',
  code: 'var(--text-primary)',
  cursor: 'var(--text-primary)',
  divider: 'var(--border-primary)',

  toolbarBackground: 'var(--bg-primary)',
  toolbarHoverBackground: 'var(--bg-secondary)',
  toolbarInput: 'var(--bg-primary)',
  toolbarItem: 'var(--text-primary)',

  tableDivider: 'var(--border-primary)',
  tableSelected: 'var(--bg-secondary)',
  tableSelectedBackground: 'var(--highlight)',

  quote: 'var(--highlight)',
  codeBackground: 'var(--bg-secondary)',
  codeBorder: 'var(--border-primary)',
  horizontalRule: 'var(--border-primary)',
  imageErrorBackground: 'var(--bg-secondary)',

  scrollbarBackground: 'var(--bg-secondary)',
  scrollbarThumb: 'var(--border-primary)',
};

export default function MarkdownEditor({
  content,
  handleContentChange,
  readOnly,
  onKeyDown,
  placeholder,
  componentKey,
}) {
  const save = async function (data) {
    const fileCompressionOptions = {
      maxSizeMB: 1, // (default: Number.POSITIVE_INFINITY),
      maxWidthOrHeight: 1280,
    };
    const compressedFile = await imageCompression(data, fileCompressionOptions);
    let formData = new FormData();
    formData.append('blob', compressedFile, data.name);

    const result = await fetch('/api/post/upload-image', {
      method: 'POST',
      body: formData,
    });

    return (await result.json()).url;
  };

  return (
    <Wrapper onKeyDown={onKeyDown}>
      <Editor
        placeholder={placeholder}
        uploadImage={save}
        defaultValue={content}
        onChange={handleContentChange}
        theme={lightTheme}
        readOnly={readOnly}
        key={componentKey}
        // extensions={readOnly ? undefined : getPlugins(populateUsers)}
      />
    </Wrapper>
  );
}

MarkdownEditor.defaultProps = {
  placeholder: 'Start writing!',
  readOnly: false,
};
