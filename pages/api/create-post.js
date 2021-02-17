import { cors, runMiddleware, validateUser } from './_utils/middleware';
import { createConnection } from './_utils/connection';
import slackNotification from './_utils/notifications/slack';

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

  const { title, summary, content, tagChannelId, lensId } = req.body;

  const connection = await createConnection();

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

  try {
    // Fire off slack notification of successfully created post
    if (process.env.SLACK_API_TOKEN) {
      await runMiddleware(req, res, slackNotification, {
        newPost,
      });
    }
  } catch (e) {
    res.status(400).json({ error: e.toString() });
    return;
  }

  res.json({ error: false, data: { id: newPost.id } });
};
