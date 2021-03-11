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

  const { id } = req.query;

  const connection = await createConnection();

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
      User.id as userId,
      User.displayName
    FROM
      Star,
      User
    WHERE
      Star.userId = User.id
    AND Star.replyId IS NULL
    AND Star.postId = ?
  `;
  const [postStarRows] = await connection.execute(postStarQuery, [id]);

  // When reading a post, mark that post as read by that user or update their last view time to now
  const markAsReadQuery = `
    INSERT INTO
    PostView
      (postId, userId)
    VALUES
      (?, ?)
    ON DUPLICATE KEY UPDATE
      lastViewed=CURRENT_TIMESTAMP(3)
  `;
  await connection.execute(markAsReadQuery, [id, user.id]);

  connection.end();

  res.json({
    data: {
      ...postRow,
      stars: postStarRows.map(star => ({
        id: star.starId,
        user: {
          id: star.userId,
          displayName: star.displayName,
        },
      })),
    },
    error: false,
  });
};
