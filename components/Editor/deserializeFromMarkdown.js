import { jsx } from 'slate-hyperscript';
import unified from 'unified';
import markdown from 'remark-parse';
import slate from 'remark-slate';

import {
  ELEMENT_PARAGRAPH,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_LINK,
  ATTRIBUTE_LINK,
  ELEMENT_CODE_BLOCK,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@udecode/slate-plugins';

export const deserialize = markdownContent => {
  console.log('input markdown:\n', markdownContent);

  var output = unified()
    .use(markdown)
    .use(slate, {
      nodeTypes: {
        paragraph: ELEMENT_PARAGRAPH,
        block_quote: ELEMENT_BLOCKQUOTE,
        link: ELEMENT_LINK,
        code_block: ELEMENT_CODE_BLOCK,
        ul_list: ELEMENT_UL,
        ol_list: ELEMENT_OL,
        listItem: ELEMENT_LI,
        heading: {
          1: ELEMENT_H2,
          2: ELEMENT_H2,
          3: ELEMENT_H3,
          4: ELEMENT_H4,
          5: ELEMENT_H5,
          6: ELEMENT_H6,
        },
      },
      linkDestinationKey: ATTRIBUTE_LINK,
    })
    .processSync(markdownContent);
  console.log('output:\n', output.result);
  return output;
};
