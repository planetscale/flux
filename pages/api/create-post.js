import mysql from 'mysql2/promise';
import { cors, validateUser } from './_utils/middleware';
const { WebClient } = require('@slack/web-api');
import { getLocaleDateTimeString } from '../../utils/dateTime';

// This is a simple database connection test to prove you can connect to a persistent store for your application.
export default async (req, res) => {
  let user;
  try {
    cors(req, res);
    user = await validateUser(req, true);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const {
    title,
    summary,
    content,
    tagChannelId,
    tagName,
    userAvatar,
    userDisplayName,
    domain,
  } = req.body;

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  const insertQuery = `
    INSERT INTO
    Post
        (title, summary, authorId, content, tagId)
    VALUES
        (?, ?, ?, ?, ?, ?)
  `;
  await connection.execute(insertQuery, [
    title,
    summary,
    user.id,
    content,
    tagChannelId,
  ]);

  const idQuery = `SELECT id, createdAt FROM Post WHERE id = LAST_INSERT_ID()`;
  const [[newPost]] = await connection.query(idQuery);
  connection.end();

  res.json({ error: false, data: { id: newPost.id } });

  // Fire off slack notification of successfully created post
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
