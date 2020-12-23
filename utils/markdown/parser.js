const showdown = require('showdown');
const matter = require('gray-matter');
import './options';

export function parseMarkdown(md) {
  const converter = new showdown.Converter();
  const html = converter.makeHtml(md);
  const parsedMeta = matter(md);

  if (!parsedMeta.data.hasOwnProperty('title')) {
    return console.error('Title metadata not found in post.');
  }
  if (!parsedMeta.data.hasOwnProperty('summary')) {
    return console.error('Summary metadata not found in post.');
  }

  return {
    content: html,
    title: parsedMeta.data['title'],
    summary: parsedMeta.data['summary'],
    tags: parsedMeta.data['tags'] ?? '',
  };
}
