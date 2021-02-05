import mysql from 'mysql2/promise';
import { cors, validateUser } from '../_utils/middleware';

// This is a simple database connection test to prove you can connect to a persistent store for your application.
export default async (req, res) => {
  try {
    cors(req, res);
    await validateUser(req);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const { id } = req.body;

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  const deleteQuery = `
    DELETE FROM 
        Star
    WHERE
        id = ?
  `;
  await connection.execute(deleteQuery, [id]);

  connection.end();

  res.json({ error: false });
};
