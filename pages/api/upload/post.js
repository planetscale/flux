import { PrismaClient } from '@prisma/client';
import { IncomingForm } from 'formidable';
import Cors from 'cors';
import { getUserId } from 'utils/auth/serverConfig';
import { getLocaleDateTimeString } from '../../../utils/dateTime';

const { WebClient } = require('@slack/web-api');

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
});

const validateUser = async (req, res, callbackFn) => {
  const authHeader = req.headers.authorization;
  let token = '';
  let userId = '';

  if (authHeader?.startsWith('Bearer ')) {
    const tokenArray = authHeader.split(' ');
    // extract the JWT, tokenArray[0] is 'Bearer '
    token = tokenArray[1];

    try {
      userId = await getUserId(token);
      callbackFn(Boolean(userId));
    } catch (e) {
      callbackFn(e);
    }
  }
};

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async (req, res) => {
  try {
    await runMiddleware(req, res, cors);
    await runMiddleware(req, res, validateUser);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const uploadRequest = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      console.log(fields);
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  // TODO: handle error, return corresponding error message
  const {
    content,
    summary,
    title,
    userId,
    lensId,
    userDisplayName,
    userAvatar,
    domain,
    tagName,
    tagChannelId,
  } = uploadRequest.fields;

  try {
    const result = await prisma.post.create({
      data: {
        content,
        summary: summary,
        title: title,
        tag: {
          connectOrCreate: {
            where: {
              name: tagName,
            },
            create: {
              name: tagName,
              channelId: tagChannelId,
            },
          },
        },
        author: {
          connect: { id: Number(userId) },
        },
        lens: {
          connect: { id: Number(lensId) },
        },
      },
    });

    // If the post database request is pushed, fire a Slack notification.
    const timeOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    const postTime = getLocaleDateTimeString(result.createdAt, timeOptions);
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
                text: `*<${domain}/|${title}>*
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

    res.json(result);
  } catch (e) {
    console.error(e);
    return res.json({ error: e });
  }
};
