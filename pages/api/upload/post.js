import { parseMarkdown } from '../../../utils/markdown/parser';
import { PrismaClient } from '@prisma/client';
import { IncomingForm } from 'formidable';
import Cors from 'cors';
import { getUserId } from 'utils/auth/serverConfig';
import { getLocaleDateTimeString } from '../../../utils/dateTime';

const axios = require('axios');

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
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  // TODO: handle error, return corresponding error message
  const {
    content,
    summary,
    title,
    tags,
    userId,
    lensId,
    userDisplayName = "Abhi Vaidyanatha", // TODO: Remove these static variables.
    userAvatar = "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
    domain = "https://flux-lime.vercel.app",
  } = uploadRequest.fields;
  const parsedContent = await parseMarkdown(content);

  const result = await prisma.post.create({
    data: {
      content: parsedContent,
      summary: summary,
      title: title,
      tags: tags,
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

  const url = 'https://slack.com/api/chat.postMessage';
  const slackRes = await axios.post(url, {
    channel: '#flux-sandbox',
    "attachments": [
      {
        "color": "#D491A5",
        "blocks": [
          {
            "type": "context",
            "elements": [
              {
                "type": "image",
                "image_url": userAvatar,
                "alt_text": "cute cat"
              },
              {
                "type": "mrkdwn",
                "text": `*${userDisplayName}* shared a new update.`
              }
            ]
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*<${domain}/|${title}>*  
${summary}`
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "context",
            "elements": [
              {
                "type": "plain_text",
                "text": `posted on ${postTime}`,
                "emoji": true
              }
            ]
          }
        ]
      }
    ]
  }, { headers: { authorization: `Bearer ${process.env.SLACK_API_TOKEN}` } });

  res.json(result);
};
