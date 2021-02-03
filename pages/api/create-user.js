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

  const { userName, displayName, orgName, avatar, bio } = req.body;

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  const userQuery = `
    INSERT INTO
    User
        (email, username, displayName, role, orgId)
    VALUES
        (?, ?, ?, ?, (SELECT id FROM Org WHERE name = ? LIMIT 1))
  `;
  await connection.execute(userQuery, [
    user.email,
    userName,
    displayName,
    'USER',
    orgName,
  ]);

  const idQuery = `SELECT id FROM User WHERE id = LAST_INSERT_ID()`;
  const [[userId]] = await connection.query(idQuery);

  const profileQuery = `
    INSERT INTO
    Profile
        (bio, avatar, userId)
    VALUES
        (?, ?, ?)
  `;
  await connection.execute(profileQuery, [bio, avatar, userId.id]);

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
    AND User.id = ?
    LIMIT 1;`;

  const [[row]] = await connection.execute(query, [userId.id]);

  connection.end();

  res.json({ error: false, data: row });
};
