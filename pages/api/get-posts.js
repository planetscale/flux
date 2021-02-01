import mysql from 'mysql2/promise';
import Cors from 'cors';
import { decodeToken } from 'utils/auth/serverConfig';

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
});

const validateUser = async (req, res, callbackFn) => {
  const authHeader = req.headers.authorization;
  let token = '';
  let decodedToken = '';

  if (authHeader?.startsWith('Bearer ')) {
    const tokenArray = authHeader.split(' ');
    // extract the JWT, tokenArray[0] is 'Bearer '
    token = tokenArray[1];

    try {
      decodedToken = await decodeToken(token);
      callbackFn(
        Boolean(decodedToken.uid) &&
          Boolean(
            decodedToken.email.match(
              new RegExp(process.env.NEXT_PUBLIC_ALLOWED_EMAIL_REGEX)
            )
          )
      );
    } catch (e) {
      callbackFn(e);
    }
  }
};

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// This is a simple database connection test to prove you can connect to a persistent store for your application.
export default async (req, res) => {
  try {
    await runMiddleware(req, res, cors);
    await runMiddleware(req, res, validateUser);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  const query = `
    SELECT
        Post.id, 
        Post.title, 
        Post.summary, 
        Post.createdAt, 
        Tag.name, 
        User.displayName 
    FROM
        Post,
        Tag,
        User
    WHERE
        Post.tagId = Tag.id 
    AND Post.authorId = User.id 
    ORDER BY createdAt DESC 
    LIMIT 10 
  `;

  const [rows] = await connection.query(query);
  connection.end();

  res.json(rows);
};
