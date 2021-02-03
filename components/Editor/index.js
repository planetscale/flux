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

export const SlateEditor = ({ users, onChange, readOnly, defaultValue }) => {
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

      <MentionSelect
        at={userMention.target}
        valueIndex={userMention.index}
        options={userMention.values}
        onClickMention={userMention.onAddMention}
      />
    </Slate>
  );
};
