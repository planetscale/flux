import mysql from 'mysql2/promise';
import { cors, validateUser } from './_utils/middleware';

module.exports = async (req, res) => {
  try {
    cors(req, res);
    await validateUser(req);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const { before, last } = req.query;

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  const query = `
    SELECT
        Post.id,
        Post.title,
        Post.summary,
        Post.createdAt,
        Tag.name as tagName,
        User.displayName as authorName
    FROM
        Post,
        Tag,
        User
    WHERE
        Post.tagId = Tag.id
    AND Post.authorId = User.id
    AND Post.id ${Number(before) === -1 ? '>' : '<'} ${before}
    ORDER BY createdAt DESC 
    LIMIT ${last}
  `;

  const [rows] = await connection.query(query);
  connection.end();

  console.log('ROWS', rows);

  res.json(rows);
};
