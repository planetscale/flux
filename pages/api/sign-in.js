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

  const connection = await createConnection();

  const idQuery = `SELECT password FROM User WHERE email = ${email}`;
  const [[password]] = await connection.query(idQuery);

  if (!password) {
    res.json({ error: `User not found` });
    return;
  }

  const correctPassword = await argon2.verify(password, pwd);

  if (!correctPassword) {
    res.json({ error: `Incorrect password` });
    return;
  }

  connection.end();

  res.json({
    error: false,
    data: {
      token: generateToken({ email }),
    },
  });
};
