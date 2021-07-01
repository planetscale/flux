import {
  cors,
  validateUser,
  validateWritable,
  runMiddleware,
} from './_utils/middleware';
import { createConnection } from './_utils/connection';
import slackNotifications from './_utils/slack-notifications';

const REMOVE_NEWLINE = /\n+|\\n+|\\\n+/gm;
const REMOVE_DOUBLESPACE = /  +/gm;

// This is a simple database connection test to prove you can connect to a persistent store for your application.
module.exports = async (req, res) => {
  let user;
  try {
    cors(req, res);
    user = await validateUser(req, true);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  try {
    validateWritable();
  } catch (e) {
    res.status(405).json({ error: e.toString() });
    return;
  }

  const {
    title,
    summary: initSummary,
    content,
    userDisplayName,
    sendNotification,
  } = req.body;

  let summary = initSummary;
  if (!initSummary) {
    summary = `${content
      .substr(0, 60)
      .replace(REMOVE_NEWLINE, ' ')
      .replace(REMOVE_DOUBLESPACE, ' ')}...`;
  }

  const connection = await createConnection();

  const insertQuery = `
    INSERT INTO
    Post
        (title, summary, authorId, content)
    VALUES
        (?, ?, ?, ?)
  `;
  await connection.execute(insertQuery, [title, summary, user.id, content]);

  const idQuery = `SELECT id, createdAt FROM Post WHERE id = LAST_INSERT_ID()`;
  const [[newPost]] = await connection.query(idQuery);
  connection.end();

  res.json({ error: false, data: { id: newPost.id } });

  try {
    // Fire off slack notification of successfully created post
    if (process.env.SLACK_API_TOKEN && sendNotification) {
      await runMiddleware(req, res, slackNotifications, {
        newPost,
      });
    }
  } catch (e) {
    console.error(e.toString());
  }
};
