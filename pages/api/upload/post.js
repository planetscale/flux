import { parseMarkdown } from '../../../utils/markdown/parser';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { IncomingForm } from 'formidable';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
});

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async (req, res) => {
  await runMiddleware(req, res, cors);

  const uploadRequest = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const readFileCallback = async (err, buf) => {
    if (err) throw new Error('Error reading file: ', err);
    const data = await parseMarkdown(buf);
    const result = await prisma.post.create({
      data: {
        content: data.content,
        summary: data.summary,
        title: data.title,
        tags: data.tags,
        author: {
          connect: { id: Number(uploadRequest.fields.userId) },
        },
        lens: {
          connect: { id: Number(uploadRequest.fields.lensId) },
        },
      },
    });

    res.json(result);
  };

  fs.readFile(uploadRequest?.files.file.path, 'utf8', readFileCallback);
  // TODO: move the res.json(result) outside of the callback scope
};
