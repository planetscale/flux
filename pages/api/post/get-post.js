import mysql from 'mysql2/promise';
import { cors, validateUser } from '../_utils/middleware';

// This is a simple database connection test to prove you can connect to a persistent store for your application.
export default async (req, res) => {
  try {
    cors(req, res);
    await validateUser(req);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const { id } = req.query;

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  const postQuery = `
    SELECT
      Post.id,
      Post.title,
      Post.summary,
      Post.createdAt,
      Post.content,
      Tag.id as tagId,
      Tag.name as tagName,
      User.id as authorId,
      User.displayName as authorName,
      User.username as authorUsername,
      Profile.avatar
    FROM
      Post,
      Tag,
      User,
      Profile
    WHERE
      User.id = Profile.userId
    AND Tag.id = Post.tagId
    AND User.id = Post.authorId
    AND Post.id = ?
    LIMIT 1
  `;
  const [[postRow]] = await connection.execute(postQuery, [id]);

  const postStarQuery = `
    SELECT
      Star.id as starId,
      User.id as userId
    FROM
      Star,
      User
    WHERE
      Star.userId = User.id
    AND Star.replyId IS NULL
    AND Star.postId = ?
  `;
  const [postStarRows] = await connection.execute(postStarQuery, [id]);

  connection.end();

  res.json({
    data: {
      ...postRow,
      stars: postStarRows,
    },
    error: false,
  });
};
