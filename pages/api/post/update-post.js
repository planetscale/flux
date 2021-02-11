import mysql from 'mysql2/promise';
import { cors, validateUser } from '../_utils/middleware';

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

  const { postId, content } = req.body;

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  const updateQuery = `
    UPDATE
      Post
    SET
      content = ?
    WHERE
      id = ?
      AND authorId = ?
  `;
  const [result] = await connection.execute(updateQuery, [
    content,
    postId,
    user.id,
  ]);
  connection.end();

  res.json({
    error:
      result.affectedRows === 0 ? 'Only the author can edit this post' : false,
  });
};
