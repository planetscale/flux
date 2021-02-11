import mysql from 'mysql2/promise';
import { cors, validateUser } from './_utils/middleware';

// This is a simple database connection test to prove you can connect to a persistent store for your application.
export default async (req, res) => {
  let user;
  try {
    cors(req, res);
    user = await validateUser(req);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  const query = `
    SELECT
      User.id,
      User.email,
      User.username,
      User.displayName,
      User.role,
      Profile.avatar,
      Org.id as orgId,
      Org.name as orgName
    FROM
      User,
      Profile,
      Org
    WHERE
      User.id = Profile.userId
    AND User.orgId = Org.id
    AND User.email = ?
    LIMIT 1;`;

  const [[row]] = await connection.execute(query, [user.email]);
  connection.end();

  res.json({ error: false, data: row });
};
