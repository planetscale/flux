import { Text } from 'slate';

export const serialize = node => {
  if (Text.isText(node)) {
    var text = node.text;

    if (node.bold) {
      text = `**${text}**`;
    }

    if (node.italic) {
      text = `_${text}_`;
    }

    if (node.strikethrough) {
      text = `~~${text}~~`;
    }

    return text;
  }

  const children = node.children.map(n => serialize(n)).join('');

  switch (node.type) {
    case 'p':
      return `${children}\n`;
    case 'mention':
      return `@${node.value}`;
    case 'h2':
      return `## ${children}\n`;
    case 'h3':
      return `### ${children}\n`;
    default:
      return children;
  }
};
