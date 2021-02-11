import { cors, validateUser } from '../_utils/middleware';
import { createConnection } from '../_utils/connection';

export default async (req, res) => {
  try {
    cors(req, res);
    await validateUser(req);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const { postId } = req.query;

  const connection = await createConnection();

  const query = `
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
        AND Reply.postId = ?
  `;
  const [replyRows] = await connection.execute(query, [postId]);

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
  replyRows.map(replyRow => {
    const { reply, star } = processRow(replyRow);
    if (!replyMap[reply.id]) {
      replyMap[reply.id] = reply;
    }
    if (star) {
      replyMap[reply.id].stars.push(star);
    }
  });

  res.json({ data: Object.values(replyMap), error: false });
};
