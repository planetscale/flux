const { WebClient } = require('@slack/web-api');
import { getLocaleDateTimeString } from 'utils/dateTime';

export default async (
  tagName,
  userAvatar,
  userDisplayName,
  domain,
  summary,
  title,
  newPost
) => {
  const timeOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const postTime = getLocaleDateTimeString(newPost.createdAt, timeOptions);
  const token = process.env.SLACK_API_TOKEN;
  const client = new WebClient(token);

  await client.chat.postMessage({
    channel: `#${tagName}`,
    attachments: [
      {
        color: '#D491A5',
        blocks: [
          {
            type: 'context',
            elements: [
              {
                type: 'image',
                image_url: userAvatar,
                alt_text: 'cute cat',
              },
              {
                type: 'mrkdwn',
                text: `*${userDisplayName}* shared a new update.`,
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*<${domain}/post/${newPost.id}|${title}>*
${summary}`,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'context',
            elements: [
              {
                type: 'plain_text',
                text: `posted on ${postTime}`,
                emoji: true,
              },
            ],
          },
        ],
      },
    ],
  });
};
