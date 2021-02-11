import { cors, validateUser } from './_utils/middleware';
import { createConnection } from './_utils/connection';

// This is a simple database connection test to prove you can connect to a persistent store for your application.
export default async (req, res) => {
  try {
    cors(req, res);
    await validateUser(req);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const connection = await createConnection();

  const query = `
    SELECT
      id,
      name
    FROM
      Tag
  `;

  const [tags] = await connection.query(query);
  connection.end();

  res.json({ error: false, data: tags });
};
