const showdown = require('showdown');
import './options';

export function parseMarkdown(md) {
  const converter = new showdown.Converter();
  const html = converter.makeHtml(md);

  return html;
}
