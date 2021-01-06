import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useState } from 'react';

const TABS = {
  WRITE: 'write',
  PREVIWE: 'preview',
};

// TODO: remove before launch if we don't need this suggestions fn.
function loadSuggestions(text) {
  return new Promise((accept, reject) => {
    setTimeout(() => {
      const suggestions = [
        {
          preview: 'Abhi',
          value: '@abhi',
        },
        {
          preview: 'Raunaq',
          value: '@raunaq',
        },
      ].filter(i => i.preview.toLowerCase().includes(text.toLowerCase()));
      accept(suggestions);
    }, 250);
  });
}

export default function MarkdownEditor() {
  const [value, setValue] = useState(
    `---title: Test Post
    summary: Testing uploading to Parallax.
    ---`
  );
  const [selectedTab, setSelectedTab] = useState(TABS.WRITE);

  const save = async function* (data) {
    // Promise that waits for "time" milliseconds
    const wait = function (time) {
      return new Promise((a, r) => {
        setTimeout(() => a(), time);
      });
    };

    // Upload "data" to your server
    // Use XMLHttpRequest.send to send a FormData object containing
    // "data"
    // Check this question: https://stackoverflow.com/questions/18055422/how-to-receive-php-image-data-over-copy-n-paste-javascript-with-xmlhttprequest

    await wait(2000);
    // yields the URL that should be inserted in the markdown
    yield 'https://picsum.photos/300';
    await wait(2000);

    // returns true meaning that the save was successful
    return true;
  };

  return (
    <div className="container">
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={markdown =>
          Promise.resolve(<ReactMarkdown source={markdown} />)
        }
        loadSuggestions={loadSuggestions}
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
        // paste={{
        //   saveImage: save,
        // }}
      />
    </div>
  );
}
