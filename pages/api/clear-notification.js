import { cors, validateUser } from './_utils/middleware';
import { createConnection } from './_utils/connection';

export default async (req, res) => {
  let user;
  try {
    cors(req, res);
    user = await validateUser(req, true);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const connection = await createConnection();

  const { postId } = req.body;

  const clearNotificationQuery = `
  INSERT INTO
    PostView
    (postId, userId) VALUES (?, ?)
  ON DUPLICATE KEY UPDATE
    lastViewed=CURRENT_TIMESTAMP(3)
  `;

  await connection.execute(clearNotificationQuery, [postId, user.id]);
  connection.end();

  res.json({ error: false });
};
