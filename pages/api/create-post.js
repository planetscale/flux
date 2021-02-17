import { cors, validateUser } from './_utils/middleware';
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

  const {
    title,
    summary,
    content,
    tagChannelId,
    tagName,
    userAvatar,
    userDisplayName,
    domain,
    lensId,
  } = req.body;

  const connection = await createConnection();

  const insertQuery = `
    INSERT INTO
    Post
        (title, summary, authorId, content, tagId, lensId)
    VALUES
        (?, ?, ?, ?, ?, ?)
  `;
  await connection.execute(insertQuery, [
    title,
    summary,
    user.id,
    content,
    tagChannelId,
    lensId,
  ]);

  const idQuery = `SELECT id, createdAt FROM Post WHERE id = LAST_INSERT_ID()`;
  const [[newPost]] = await connection.query(idQuery);
  connection.end();

  res.json({ error: false, data: { id: newPost.id } });

  // Fire off slack notification of successfully created post
  if (process.env.SLACK_API_TOKEN) {
    slackNotification(
      tagName,
      userAvatar,
      userDisplayName,
      domain,
      summary,
      title,
      newPost
    );
  }
};
