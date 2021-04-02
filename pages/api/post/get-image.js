import { cors, validateUser } from '../_utils/middleware';
import { createConnection } from '../_utils/connection';

export default async (req, res) => {
  try {
    cors(req, res);
    await validateUser(req);
  } catch (e) {
    res.status(401).json({ error: e.toString() });
    return;
  }

  const { name } = req.query;
  const connection = await createConnection();

  const imageQuery = `
    SELECT
      image
    FROM
      Image
    WHERE
     name = ?
  `;
  const [rows, fields] = await connection.execute(imageQuery, [name]);
  connection.end();

  res.setHeader('Content-Type', 'image/*');
  res.send(rows[0].image);
};
