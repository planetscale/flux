import {
  addMentionNodes,
  addTagNodes,
  getMentionsPlugin,
} from 'prosemirror-mentions';
import { toggleMark } from 'prosemirror-commands';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { Extension } from 'rich-markdown-editor';

class EditorPluginsExtension extends Extension {
  plugins = [];
  constructor({ plugins }) {
    super();
    this.plugins = plugins;
  }

  get plugins() {
    return this.plugins;
  }
}

class EditorMarksExtension extends Extension {
  name = '';
  schema = '';
  constructor({ name, schema }) {
    super();
    this.name = name;
    this.schema = schema;
  }

  get type() {
    return 'mark';
  }
  get name() {
    return this.name;
  }
  get schema() {
    return this.schema;
  }

  get markdownToken() {
    return '';
  }

  get toMarkdown() {
    return {};
  }

  parseMarkdown() {
    return {
      mark: this.name,
    };
  }

  commands({ type }) {
    return () => toggleMark(type);
  }
}

class EditorNodesExtension extends Extension {
  name = '';
  schema = '';
  constructor({ name, schema }) {
    super();
    this.name = name;
    this.schema = schema;
  }

  get type() {
    return 'node';
  }
  get name() {
    return this.name;
  }

  get schema() {
    return this.schema;
  }

  get markdownToken() {
    return '';
  }
  toMarkdown(state, node) {
    state.write(`${node.attrs.id}`);
  }
  parseMarkdown() {
    // TODO: make parseMarkdown work, need to read source code

    return {
      block: this.name,
      getAttrs: token => {
        // do something here
      },
    };
  }
}

const marksRaw = basicSchema.spec.marks.content;
const nodesRaw = addTagNodes(addMentionNodes(basicSchema.spec.nodes)).content;

let marks = [];
for (let marksIndex = 0; marksIndex < marksRaw.length; marksIndex += 2) {
  marks.push(
    new EditorMarksExtension({
      name: marksRaw[marksIndex],
      schema: marksRaw[marksIndex + 1],
    })
  );
}

let nodes = [];
for (
  let nodesIndex = nodesRaw.length - 4;
  nodesIndex < nodesRaw.length;
  nodesIndex += 2
) {
  nodes.push(
    new EditorNodesExtension({
      name: nodesRaw[nodesIndex],
      schema: nodesRaw[nodesIndex + 1],
    })
  );
}

const getPlugins = populateUsers => {
  /**
   * IMPORTANT: outer div's "suggestion-item-list" class is mandatory. The plugin uses this class for querying.
   * IMPORTANT: inner div's "suggestion-item" class is mandatory too for the same reasons
   */
  const getMentionSuggestionsHTML = items =>
    '<div class="suggestion-item-list">' +
    items
      ?.map(i => '<div class="suggestion-item">' + i.name + '</div>')
      .join('') +
    '</div>';
  const getTagSuggestionsHTML = items =>
    '<div class="suggestion-item-list">' +
    items
      ?.map(i => '<div class="suggestion-item">' + i.tag + '</div>')
      .join('') +
    '</div>';

  let mentionPlugin = getMentionsPlugin({
    getSuggestions: (type, text, done) => {
      setTimeout(async () => {
        if (type === 'mention') {
          const users = await populateUsers(text);
          if (users?.length) {
            done(users);
          }
        } else {
          // done([{ tag: 'WikiLeaks' }, { tag: 'NetNeutrality' }]);
          done();
        }
      }, 0);
    },
    getSuggestionsHTML: (items, type) => {
      if (type === 'mention') {
        return getMentionSuggestionsHTML(items);
      } else if (type === 'tag') {
        return getTagSuggestionsHTML(items);
      }
    },
  });
  return [
    new EditorPluginsExtension({ plugins: [mentionPlugin] }),
    ...marks,
    ...nodes,
  ];
};

export default getPlugins;
