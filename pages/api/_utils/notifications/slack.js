const { WebClient } = require('@slack/web-api');
import { getLocaleDateTimeString } from 'utils/dateTime';

export default async (req, res, handler, params) => {
  const {
    tagName,
    userAvatar,
    userDisplayName,
    domain,
    summary,
    title,
  } = req.body;

  const timeOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  try {
    const postTime = getLocaleDateTimeString(
      params.newPost.createdAt,
      timeOptions
    );
    const client = new WebClient(process.env.SLACK_API_TOKEN);

    const resp = await client.chat.postMessage({
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
                text: `*<${domain}/post/${params.newPost.id}|${title}>*
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

    handler(resp);
  } catch (error) {
    handler(error);
  }
};
