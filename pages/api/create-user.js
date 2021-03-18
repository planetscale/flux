import { cors, validateUser } from './_utils/middleware';
import { createConnection } from './_utils/connection';

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

  const connection = await createConnection();

  const userQuery = `
    INSERT INTO
    User
        (email, username, displayName, role, orgId)
    VALUES
        (?, ?, ?, ?, ?)
  `;
  await connection.execute(userQuery, [
    user.email,
    userName,
    displayName,
    'USER',
    1, // TODO: There is only one org so hard coding it as the org id when creating users
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
