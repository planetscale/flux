import { cors, validateUser } from './_utils/middleware';
import { createConnection } from './_utils/connection';

export default async (req, res) => {
  try {
    cors(req, res);
    await validateUser(req);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const { before, last, tag } = req.query;

  const connection = await createConnection();

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
    AND Post.id ${Number(before) === -1 ? '>' : '<'} ?
    ${tag ? 'AND Tag.name = ?' : ''}
    ORDER BY createdAt DESC 
    LIMIT ?
  `;

  const values = [Number(before)];
  if (tag) {
    values.push(tag);
  }
  values.push(Number(last));
  const [rows] = await connection.execute(query, values);
  connection.end();

  res.json(rows);
};
