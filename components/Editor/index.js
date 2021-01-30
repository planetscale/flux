import React, { useMemo, useState } from 'react';
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
  StrikethroughPlugin,
  withAutoformat,
  withList,
  MentionPlugin,
  MentionSelect,
  useMention,
  withInlineVoid,
} from '@udecode/slate-plugins';
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

export const SlateEditor = ({ users }) => {
  const plugins = [
    ParagraphPlugin(options),
    BoldPlugin(),
    ItalicPlugin(),
    CodePlugin(),
    StrikethroughPlugin(),
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
  ];

  const withPlugins = [
    withReact,
    withHistory,
    withList(options),
    withAutoformat({
      rules: autoformatRules,
    }),
    withInlineVoid({ plugins }),
  ];

  const [value, setValue] = useState(initialValueAutoformat);
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  const {
    onAddMention,
    onChangeMention,
    onKeyDownMention,
    search,
    index,
    target,
    values,
  } = useMention(users, {
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
      <EditablePlugins
        plugins={plugins}
        placeholder="Start writing!"
        onKeyDown={[onKeyDownMention]}
        onKeyDownDeps={[index, search, target]}
        spellCheck
        autoFocus
      />

      <MentionSelect
        at={target}
        valueIndex={index}
        options={values}
        onClickMention={onAddMention}
      />
    </Slate>
  );
};
