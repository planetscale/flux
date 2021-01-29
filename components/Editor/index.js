import React, { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { autoformatRules } from './autoformatRules';
import { headingTypes, options, optionsResetBlockTypes } from './initialValues';

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
  ResetBlockTypePlugin,
  SoftBreakPlugin,
  StrikethroughPlugin,
  withAutoformat,
  withList,
  pipe,
} from '@udecode/slate-plugins';

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
];

const withPlugins = [
  withReact,
  withHistory,
  withList(options),
  withAutoformat({
    rules: autoformatRules,
  }),
];

export default function Editor() {
  const [value, setValue] = useState(initialValue);
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => {
        setValue(newValue);
      }}
    >
      <EditablePlugins
        plugins={plugins}
        placeholder="Start writing!"
        spellCheck
      />
    </Slate>
  );
}
