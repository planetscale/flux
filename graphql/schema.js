import {
  objectType,
  queryType,
  mutationType,
  makeSchema,
  arg,
  intArg,
} from '@nexus/schema';
import { nexusPrisma } from 'nexus-plugin-prisma';
import path from 'path';
import { notValidError } from '../utils/upload/errors';
import { readStream } from '../utils/upload/stream';
import { parseMarkdown } from '../utils/markdown/parser';
import { GraphQLUpload } from 'apollo-server-core';

const Org = objectType({
  name: 'Org',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.createdAt();
    t.model.users();
    t.list.field('lenses', {
      type: 'Lens',
      resolve(_parent, _args, ctx) {
        return ctx.prisma.lens.findMany({});
      },
    });
  },
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.username();
    t.model.displayName();
    t.model.role();
    t.model.posts();
    t.model.profile();
    t.model.org();
    t.model.createdAt();
  },
});

const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.model.id();
    t.model.bio();
    t.model.avatar();
    t.model.user();
  },
});

const Lens = objectType({
  name: 'Lens',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.org();
    t.model.posts();
  },
});

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.title();
    t.model.summary();
    t.model.published();
    t.model.tags();
    t.model.author();
    t.model.lens();
    t.model.replies();
    t.model.content();
    t.model.stars();
  },
});

const Star = objectType({
  name: 'Star',
  definition(t) {
    t.model.id();
    t.model.post();
    t.model.user();
  },
});

const Reply = objectType({
  name: 'Reply',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.post();
    t.model.author();
    t.model.content();
  },
});

const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.org();
    t.crud.orgs();
    t.crud.post();
    t.crud.posts();
    t.crud.lens();
    t.list.field('lenses', {
      type: 'Lens',
      resolve(_parent, _args, ctx) {
        ctx.prisma.user.updateOneUser();
        return ctx.prisma.lens.findMany({});
      },
    });
    t.crud.replies();
  },
});

export const Upload = GraphQLUpload;

const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser();
    t.crud.updateOneUser();
    t.crud.deleteOneUser();
    t.crud.createOneOrg();
    t.crud.updateOneOrg();
    t.crud.deleteOneOrg();
    t.crud.createOneLens();
    t.crud.updateOneLens();
    t.crud.deleteOneLens();
    // t.crud.createOnePost(); is replaced by postUpload().
    t.crud.updateOnePost();
    t.crud.deleteOnePost();
    t.crud.createOneReply();
    t.crud.updateOneReply();
    t.crud.deleteOneReply();
    t.crud.createOneStar();
    t.crud.deleteOneStar();
    t.field('postUpload', {
      type: 'Post',
      args: {
        file: arg({ type: 'Upload' }),
        userId: intArg({ description: 'id of the user' }),
        lensId: intArg({ description: 'lens the user is posting in' }),
        orgId: intArg({ description: 'org the user is posting in' }),
      },
      resolve: async (root, args, ctx) => {
        const { stream, filename, mimetype, encoding } = await args.file;
        if (!filename) {
          throw notValidError('Invalid file name.');
        }
        const ext = filename.split('.').pop();
        if (ext !== 'md') {
          throw notValidError('Invalid file type, must be Markdown.');
        }
        const buf = await readStream(stream);
        const data = await parseMarkdown(buf.data);
        const user = ctx.prisma.user.findFirst({ where: { id: args.userId } });
        const lens = ctx.prisma.lens.findFirst({ where: { id: args.lensId } });
        const org = ctx.prisma.lens.findFirst({ where: { id: args.orgId } });

        return ctx.prisma.post.create({
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
      },
    });
  },
});

export const schema = makeSchema({
  types: [User, Org, Profile, Lens, Post, Reply, Query, Mutation, Star, Upload],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), 'generated', 'schema.graphql'),
  },
});
