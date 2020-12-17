const showdown = require('showdown');
const matter = require('gray-matter');

export function parseMarkdown({ md }) {
  const converter = new showdown.Converter();
  const html = converter.makeHtml(md);
  const parsedMeta = matter(converter.getMetadata());

  if (!parsedMeta.hasOwnProperty('title')) {
    return console.error('Title metadata not found in post.');
  }
  if (!parsedMeta.hasOwnProperty('summary')) {
    return console.error('Summary metadata not found in post.');
  }
  if (!parsedMeta.hasOwnProperty('tags')) {
    return console.error('Tags metadata not found in post.');
  }

  return {
    content: html,
    title: parsedMeta['title'],
    summary: parsedMeta['summary'],
    tags: parsedMeta['tags'],
  };
}
