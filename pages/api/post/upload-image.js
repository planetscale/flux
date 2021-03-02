import { cors, validateUser } from '../_utils/middleware';
import { createConnection } from '../_utils/connection';
import { IncomingForm } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
var fs = require('fs');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  try {
    cors(req, res);
    await validateUser(req);
  } catch (e) {
    res.status(400).json({ error: e.toString() });
    return;
  }

  const uploadRequest = await new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiple: true });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  let name = uuidv4();

  fs.readFile(uploadRequest?.files?.blob?.path, async function (err, data) {
    if (err) {
      res.status(400).json({ error: e.toString() });
      return;
    }

    const connection = await createConnection();

    const insertQuery = `
      INSERT INTO
      Image
          (name,image)
      VALUES
          (?, ?)
    `;

    await connection.execute(insertQuery, [name, data]);
  });

  res.json({
    url: `/api/post/get-image?name=${name}`,
  });
};