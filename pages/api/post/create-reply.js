import { cors, validateUser, validateWritable } from '../_utils/middleware';
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

  try {
    validateWritable();
  } catch (e) {
    res.status(405).json({ error: e.toString() });
    return;
  }

  const { postId, content, parentId } = req.body;

  const connection = await createConnection();

  const insertQuery = `
    INSERT INTO
    Reply
        (postId, authorId, content, parentId)
    VALUES
        (?, ?, ?, ?)
  `;
  await connection.execute(insertQuery, [
    postId,
    user.id,
    content,
    parentId || null,
  ]);

  const getQuery = `
    SELECT
      Profile.avatar,
      Reply.id,
      Reply.content,
      Reply.createdAt,
      Reply.parentId,
      User.id as authorId,
      User.displayName as authorDisplayName,
      User.username as authorUsername
    FROM
      Profile,
      Reply,
      User 
    WHERE
        Reply.authorId = User.id
        AND Profile.userId = User.id
        AND Reply.postId = ?
        AND Reply.id = LAST_INSERT_ID()
  `;

  const [[newReply]] = await connection.execute(getQuery, [postId]);

  connection.end();

  const formatted = {
    id: newReply.id,
    author: {
      displayName: newReply.authorDisplayName,
      id: newReply.authorId,
      profile: {
        avatar: newReply.avatar,
      },
      username: newReply.authorUsername,
    },
    content: newReply.content,
    createdAt: newReply.createdAt,
    parentId: newReply.parentId,
    stars: [],
  };

  res.json({ data: formatted });
};
