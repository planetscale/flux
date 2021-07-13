const { WebClient } = require('@slack/web-api');
import { getLocaleDateTimeString } from 'utils/dateTime';

export default async (req, res, handler, params) => {
  const { userDisplayName, summary, title } = req.body;
  const domain =
    process.env.VERCEL_ENV === 'production'
      ? `https://${process.env.PROD_DOMAIN}`
      : `https://${process.env.VERCEL_URL}`;
  const channel =
    process.env.VERCEL_ENV === 'production' ? '#general' : '#flux-sandbox';

  const timeOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  try {
    const postTime = getLocaleDateTimeString(
      params.newPost.createdAt,
      timeOptions
    );
    const client = new WebClient(process.env.SLACK_API_TOKEN);

    const resp = await client.chat.postMessage({
      channel: channel,
      attachments: [
        {
          color: '#D491A5',
          blocks: [
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
                  text: `${userDisplayName} posted on ${postTime}`,
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
