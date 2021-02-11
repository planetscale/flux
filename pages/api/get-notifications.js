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
  SELECT
    Post.id,
    Post.title,
    Post.createdAt,
    Tag.name as tagName,
    User.displayName as authorName,
    (PostView.id IS NULL) AS isNewPost,
    COUNT(Reply.id) AS numNewReplies
  FROM
    Tag,
    User,
    Post
    LEFT JOIN PostView ON Post.id = PostView.postId
    LEFT JOIN Reply ON Reply.postId = Post.id
      AND Reply.createdAt > PostView.lastViewed
  WHERE
    Post.tagId = Tag.id
    AND Post.authorId = User.id
    AND (
      PostView.userId = 15
      OR PostView.id IS Null
    )
  GROUP BY
    Post.id,
    Tag.id,
    User.id,
    PostView.id
  HAVING
    numNewReplies > 0
    OR isNewPost
  ORDER BY
    Post.createdAt DESC
  `;

  const [rows] = await connection.execute(newPostsQuery, [user.id]);
  connection.end();

  res.json(
    rows.map(row => ({
      ...row,
      isNewPost: Boolean(row.isNewPost),
    }))
  );
};
