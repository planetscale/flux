import React, { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import {
  LooksTwo,
  Looks3,
  Looks4,
  Looks5,
  Looks6,
  FormatQuote,
  Code,
} from '@styled-icons/material-sharp';

import {
  DEFAULTS_ALIGN,
  DEFAULTS_BLOCKQUOTE,
  DEFAULTS_BOLD,
  DEFAULTS_CODE,
  DEFAULTS_CODE_BLOCK,
  DEFAULTS_HEADING,
  DEFAULTS_HIGHLIGHT,
  DEFAULTS_IMAGE,
  DEFAULTS_ITALIC,
  DEFAULTS_KBD,
  DEFAULTS_LINK,
  DEFAULTS_LIST,
  DEFAULTS_MEDIA_EMBED,
  DEFAULTS_MENTION,
  DEFAULTS_PARAGRAPH,
  DEFAULTS_SEARCH_HIGHLIGHT,
  DEFAULTS_STRIKETHROUGH,
  DEFAULTS_SUBSUPSCRIPT,
  DEFAULTS_TABLE,
  DEFAULTS_TODO_LIST,
  DEFAULTS_UNDERLINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  ResetBlockTypePluginOptions,
  setDefaults,
  SlateDocument,
  SlateDocumentDescendant,
  SlateDocumentFragment,
  MentionNodeData,
} from '@udecode/slate-plugins';

import {
  ParagraphPlugin,
  BoldPlugin,
  ItalicPlugin,
  CodePlugin,
  StrikethroughPlugin,
  BlockquotePlugin,
  ListPlugin,
  HeadingPlugin,
  HeadingToolbar,
  ToolbarElement,
  CodeBlockPlugin,
  PreviewPlugin,
  UnderlinePlugin,
  EditablePlugins,
  MentionPlugin,
  MentionSelect,
  useMention,
  withInlineVoid,
  pipe,
} from '@udecode/slate-plugins';

export const options = {
  ...setDefaults(DEFAULTS_PARAGRAPH, {}),
  ...setDefaults(DEFAULTS_MENTION, {}),
  ...setDefaults(DEFAULTS_BLOCKQUOTE, {}),
  ...setDefaults(DEFAULTS_CODE_BLOCK, {}),
  ...setDefaults(DEFAULTS_LINK, {}),
  ...setDefaults(DEFAULTS_IMAGE, {}),
  ...setDefaults(DEFAULTS_MEDIA_EMBED, {}),
  ...setDefaults(DEFAULTS_TODO_LIST, {}),
  ...setDefaults(DEFAULTS_TABLE, {}),
  ...setDefaults(DEFAULTS_LIST, {}),
  ...setDefaults(DEFAULTS_HEADING, {}),
  ...setDefaults(DEFAULTS_ALIGN, {}),
  ...setDefaults(DEFAULTS_BOLD, {}),
  ...setDefaults(DEFAULTS_ITALIC, {}),
  ...setDefaults(DEFAULTS_UNDERLINE, {}),
  ...setDefaults(DEFAULTS_STRIKETHROUGH, {}),
  ...setDefaults(DEFAULTS_CODE, {}),
  ...setDefaults(DEFAULTS_KBD, {}),
  ...setDefaults(DEFAULTS_SUBSUPSCRIPT, {}),
  ...setDefaults(DEFAULTS_HIGHLIGHT, {}),
  ...setDefaults(DEFAULTS_SEARCH_HIGHLIGHT, {}),
};

const initialValue = [
  {
    type: options.p.type,
    children: [
      {
        text: '',
      },
    ],
  },
];

const plugins = [
  ParagraphPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  HeadingPlugin(),
  PreviewPlugin(),
  MentionPlugin(),
  CodeBlockPlugin(),
  BlockquotePlugin(),
];
const withPlugins = [withReact, withHistory, withInlineVoid({ plugins })];

// TODO: replace with react prop to input a list of users
const exampleArray = [{ value: 'shawnwang' }, { value: 'raunaqgupta' }];

export default function Editor() {
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);
  const [value, setValue] = useState(initialValue);

  const {
    onAddMention,
    onChangeMention,
    onKeyDownMention,
    search,
    index,
    target,
    values,
  } = useMention(exampleArray, {
    maxSuggestions: 10,
    trigger: '@',
  });

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => {
        setValue(newValue);
        onChangeMention(editor);
      }}
    >
      <HeadingToolbar>
        <ToolbarElement type={options.h2.type} icon={<LooksTwo />} />
        <ToolbarElement type={options.h3.type} icon={<Looks3 />} />
        <ToolbarElement type={options.h4.type} icon={<Looks4 />} />
        <ToolbarElement type={options.h5.type} icon={<Looks5 />} />
        <ToolbarElement type={options.h6.type} icon={<Looks6 />} />
        <ToolbarElement type={options.blockquote.type} icon={<FormatQuote />} />
        <ToolbarElement type={options.code_block.type} icon={<Code />} />
      </HeadingToolbar>

      <EditablePlugins
        plugins={plugins}
        placeholder="Your post goes here"
        onKeyDown={[onKeyDownMention]}
        onKeyDownDeps={[index, search, target]}
        spellCheck
      />

      <MentionSelect
        at={target}
        valueIndex={index}
        options={values}
        onClickMention={onAddMention}
      />
    </Slate>
  );
}
