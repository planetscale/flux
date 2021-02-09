import { cors, validateUser } from '../_utils/middleware';
import { createConnection } from '../_utils/connection';

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

  const { postId, replyId } = req.body;

  const connection = await createConnection();

  const insertQuery = `
    INSERT INTO
    Star
        (postId, userId, replyId)
    VALUES
        (?, ?, ?)
  `;
  await connection.execute(insertQuery, [postId, user.id, replyId || null]);

  const idQuery = `SELECT LAST_INSERT_ID() as id;`;
  const [[id]] = await connection.query(idQuery);

  connection.end();

  res.json({
    id: id.id,
  });
};
