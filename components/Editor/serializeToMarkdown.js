import { Text } from 'slate';

export const serialize = node => {
  console.log(node);
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

  switch (node.type) {
    case 'a':
      return `[${node.children[0].text}](${node.url})`;
    case 'mention':
      return `[@${node.value}](/user/${node.value})`;
    case 'img':
      return `![${node.children[0].url}](${node.url})\n`;
  }

  const children = node.children.map(n => serialize(n)).join('');

  switch (node.type) {
    case 'p':
      return `${children}\n\n`;
    case 'h2':
      return `## ${children}\n`;
    case 'h3':
      return `### ${children}\n`;
    default:
      return children;
  }
};
