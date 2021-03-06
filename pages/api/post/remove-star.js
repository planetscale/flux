import { cors, validateUser, validateWritable } from '../_utils/middleware';
import { createConnection } from '../_utils/connection';

// This is a simple database connection test to prove you can connect to a persistent store for your application.
export default async (req, res) => {
  try {
    cors(req, res);
    await validateUser(req);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  try {
    validateWritable();
  } catch (e) {
    res.status(405).json({ error: e.toString() });
    return;
  }

  const { id } = req.body;

  const connection = await createConnection();

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
