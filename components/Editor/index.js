import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import {
  BlockquotePlugin,
  BoldPlugin,
  CodeBlockPlugin,
  CodePlugin,
  EditablePlugins,
  ExitBreakPlugin,
  HeadingPlugin,
  ItalicPlugin,
  ListPlugin,
  ParagraphPlugin,
  pipe,
  ResetBlockTypePlugin,
  SoftBreakPlugin,
  withAutoformat,
  withList,
  MentionPlugin,
  MentionSelect,
  useMention,
  withInlineVoid,
  LinkPlugin,
  withLink,
  ImagePlugin,
  withImageUpload,
  withSelectOnBackspace,
  HeadingToolbar,
  ToolbarMark,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
} from '@udecode/slate-plugins';
import { ToolbarUploadImage } from './uploadImageToolbarAction';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import { autoformatRules } from './autoFormatRules';
import {
  headingTypes,
  options,
  optionsResetBlockTypes,
  initialValueAutoformat,
} from './initialValues';

import {
  Image,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
} from '@styled-icons/material-sharp';

const EditorWrapper = styled.div`
  > .slate-Toolbar {
    margin: 0;
    padding: 0 0.5em;
    border: 0;
    background-color: var(--accent3);
    border-radius: 6px;
  }

  img {
    max-height: unset !important;
    border: 1px solid var(--accent2);
    padding: 0.5em;
    border-radius: 6px;
  }
`;

export const SlateEditor = ({ users, onChange, readOnly, defaultValue }) => {
  const plugins = [
    ParagraphPlugin(options),
    BoldPlugin(),
    ItalicPlugin(),
    CodePlugin(),
    BlockquotePlugin(options),
    ListPlugin(options),
    HeadingPlugin(options),
    CodeBlockPlugin(options),
    ResetBlockTypePlugin(optionsResetBlockTypes),
    SoftBreakPlugin({
      rules: [
        { hotkey: 'shift+enter' },
        {
          hotkey: 'enter',
          query: {
            allow: [options.code_block.type, options.blockquote.type],
          },
        },
      ],
    }),
    ExitBreakPlugin({
      rules: [
        {
          hotkey: 'mod+enter',
        },
        {
          hotkey: 'mod+shift+enter',
          before: true,
        },
        {
          hotkey: 'enter',
          query: {
            start: true,
            end: true,
            allow: headingTypes,
          },
        },
      ],
    }),
    MentionPlugin(),
    LinkPlugin(),
    ImagePlugin(options),
  ];

  const withPlugins = [
    withReact,
    withHistory,
    withList(options),
    withAutoformat({
      rules: autoformatRules,
    }),
    withLink(options),
    withImageUpload(),
    withInlineVoid({ plugins }),
    withSelectOnBackspace({ allow: [options.img.type] }),
  ];

  if (defaultValue === undefined || defaultValue.length === 0) {
    defaultValue = initialValueAutoformat;
  }

  const [value, setValue] = useState(defaultValue);
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  const userMention = useMention(users, {
    maxSuggestions: 10,
    trigger: '@',
  });

  return (
    <EditorWrapper>
      <Slate
        editor={editor}
        value={value}
        onChange={newValue => {
          setValue(newValue);
          onChange(newValue);
          userMention.onChangeMention(editor);
        }}
      >
        <EditablePlugins
          readOnly={readOnly || false}
          plugins={plugins}
          placeholder="Start writing!"
          onKeyDown={[userMention.onKeyDownMention]}
          onKeyDownDeps={[
            userMention.index,
            userMention.search,
            userMention.target,
          ]}
          spellCheck
          autoFocus
        />

        {!readOnly && (
          <HeadingToolbar>
            <ToolbarUploadImage icon={<Image />} />
            <ToolbarMark type={MARK_BOLD} icon={<FormatBold />}></ToolbarMark>
            <ToolbarMark
              type={MARK_ITALIC}
              icon={<FormatItalic />}
            ></ToolbarMark>
            <ToolbarMark
              type={MARK_UNDERLINE}
              icon={<FormatUnderlined />}
            ></ToolbarMark>
          </HeadingToolbar>
        )}

        <MentionSelect
          at={userMention.target}
          valueIndex={userMention.index}
          options={userMention.values}
          onClickMention={userMention.onAddMention}
        />
      </Slate>
    </EditorWrapper>
  );
};
