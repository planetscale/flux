import { readStream } from '../../../utils/upload/stream';
import { parseMarkdown } from '../../../utils/markdown/parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const buf = await readStream(req.body);
  const data = await parseMarkdown(buf.data);
  const user = prisma.user.findFirst({ where: { id: args.userId } });
  const lens = prisma.lens.findFirst({ where: { id: args.lensId } });
  const org = prisma.lens.findFirst({ where: { id: args.orgId } });

  const result = await prisma.post.create({
    data: {
      content: data.content,
      summary: data.summary,
      title: data.title,
      tags: data.tags,
      author: user,
      lens: lens,
      org: org,
    },
  });

  res.json(result);
};
