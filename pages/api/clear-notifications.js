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

  // Retrieve all unread posts and posts with unread comments in a single query.
  const newPostsQuery = `
    SELECT postId, ? as userId FROM (
      SELECT
        Post.id as postId,
        (PostView.id IS NULL) AS isNewPost,
        COUNT(Reply.id) AS numNewReplies
      FROM
        User,
        Post
        LEFT JOIN PostView ON Post.id = PostView.postId
        LEFT JOIN Reply ON Reply.postId = Post.id
          AND Reply.createdAt > PostView.lastViewed
      WHERE
        Post.authorId = User.id
        AND (
          PostView.userId = ?
          OR PostView.id IS Null
        )
      GROUP BY
        Post.id,
        PostView.id
      HAVING
        numNewReplies > 0
        OR isNewPost
    ) AS Notifications
    `;

  const clearNotificationsQuery = `
  INSERT INTO
    PostView
    (postId, userId) ${newPostsQuery}
  ON DUPLICATE KEY UPDATE
    lastViewed=CURRENT_TIMESTAMP(3)
  `;

  console.log('QUERY', clearNotificationsQuery);
  await connection.execute(clearNotificationsQuery, [user.id, user.id]);
  connection.end();

  res.json({ error: false });
};
