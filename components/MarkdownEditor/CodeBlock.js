import React from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function CodeBlock({ language, value }) {
  return (
    <SyntaxHighlighter language={language || 'text'} style={tomorrow}>
      {value}
    </SyntaxHighlighter>
  );
}
