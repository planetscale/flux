import { cors } from './_utils/middleware';
import { createConnection } from './_utils/connection';
import * as argon2 from 'argon2';
import { generateToken } from 'utils/auth/authServer';

export default async (req, res) => {
  try {
    cors(req, res);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const { email, pwd } = req.body;

  const passwordHashed = await argon2.hash(pwd);

  const connection = await createConnection();

  const idQuery = `SELECT id FROM User WHERE email = ${email}`;
  const [[userId]] = await connection.query(idQuery);

  if (userId) {
    res.json({ error: `Email ${email} has been used.` });
    return;
  }

  const userSignUpQuery = `
    INSERT INTO
    User
        (email, password)
    VALUES
        (?, ?)
  `;
  await connection.execute(userSignUpQuery, [email, passwordHashed]);
  connection.end();

  res.json({
    error: false,
    data: {
      token: generateToken({ email }),
    },
  });
};
