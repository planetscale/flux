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

  const { replyId, content } = req.body;

  const connection = await createConnection();

  const updateQuery = `
    UPDATE
        Reply
    SET
        content = ?
    WHERE
        id = ?
        AND authorId = ?
  `;
  const [result] = await connection.execute(updateQuery, [
    content,
    replyId,
    user.id,
  ]);
  if (result.affectedRows === 0) {
    res.json({ data: [], error: 'Only the author can edit this post' });
    return;
  }

  // FIX ME: Refetching everything here feels bad when all we did was update content
  const getQuery = `
  SELECT
      Profile.avatar,
      Reply.id,
      Reply.content,
      Reply.createdAt,
      Reply.parentId,
      r_user.id as replyAuthorId,
      r_user.displayName as replyAuthorDisplayName,
      r_user.username as replyAuthorUsername,
      Star.id as starId,
      s_user.id as starUserId
  FROM
      Profile,
      Reply
      LEFT JOIN Star
          ON Star.replyId = Reply.id
      LEFT JOIN User r_user
          ON Reply.authorId = r_user.id
      LEFT JOIN User s_user 
          ON Star.userId = s_user.id
  WHERE
      Profile.userId = Reply.authorId
      AND Reply.id = ?
`;
  const [rows] = await connection.execute(getQuery, [replyId]);

  connection.end();

  const processRow = row => {
    const reply = {
      id: row.id,
      author: {
        displayName: row.replyAuthorDisplayName,
        id: row.replyAuthorId,
        profile: {
          avatar: row.avatar,
        },
        username: row.replyAuthorUsername,
      },
      content: row.content,
      createdAt: row.createdAt,
      parentId: row.parentId,
      stars: [],
    };

    let star;
    if (row.starId) {
      star = {
        id: row.starId,
        user: { id: row.starUserId },
      };
    }

    return { reply, star };
  };

  const replyMap = {};
  rows.map(replyRow => {
    const { reply, star } = processRow(replyRow);
    if (!replyMap[reply.id]) {
      replyMap[reply.id] = reply;
    }
    if (star) {
      replyMap[reply.id].stars.push(star);
    }
  });

  res.json({ data: Object.values(replyMap)[0] });
};
