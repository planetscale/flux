import unified from 'unified';
import markdown from 'remark-parse';
import { remarkToSlate } from 'remark-slate-transformer';
import { initialValueAutoformat } from './initialValues';

export const deserialize = markdownContent => {
  var output = unified()
    .use(markdown)
    .use(remarkToSlate)
    .processSync(markdownContent).result;

  const slateWrapper = output.length ? output : initialValueAutoformat;

  // Below is an extremely convulated way to replace the image type wrongfully thrown by the transformer
  const newOutput = JSON.parse(
    JSON.stringify(slateWrapper).replace('"type":"image"', '"type":"img"')
  );
  console.log(newOutput);
  return newOutput;
};
