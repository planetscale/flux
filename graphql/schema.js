import {arg, intArg, makeSchema, mutationType, objectType, queryType,} from '@nexus/schema';
import {nexusPrisma} from 'nexus-plugin-prisma';
import path from 'path';
import {notValidError} from '../utils/upload/errors';
import {readStream} from '../utils/upload/stream';
import {parseMarkdown} from '../utils/markdown/parser';
import {GraphQLUpload} from 'apollo-server-core';

const { WebClient, LogLevel } = require("@slack/web-api");

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
    t.model.parentId();
  },
});

const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id();
    t.model.name();
  },
});

// Type for retrieving Slack channel names from Slack API.
const Channel = objectType({
  name: 'Channel',
  definition(t) {
    t.id();
    t.string('name');
  },
});

const token = process.env.SLACK_API_TOKEN;
const client = new WebClient(token);

const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.org();
    t.list.field('orgs', {
      type: 'Org',
      resolve(_parent, _args, ctx) {
        return ctx.prisma.org.findMany({
          where: {
            name: 'planetscale', // TODO: Fix hack to only return organizations which users belong to.
          },
        });
      },
    });
    t.crud.post();
    t.crud.posts();
    t.crud.lens();
    t.list.field('lenses', {
      type: 'Lens',
      resolve(_parent, _args, ctx) {
        return ctx.prisma.lens.findMany({});
      },
    });
    t.list.field('channels', {
      type: 'Channel',
      async resolve(_parent, _args, _ctx) {
        try {
          const authRes = await client.auth.test();
          console.log(authRes)
          const slackRes = await client.conversations.list({
            exclude_archived: true,
            limit: 1000,
          });
          return slackRes.channels.map(
              channel => ({
                id: channel.id,
                name: channel.name
              })
          );
        }
        catch (error) {
          console.error(error);
        }
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
  types: [
    User,
    Org,
    Profile,
    Lens,
    Post,
    Reply,
    Query,
    Mutation,
    Star,
    Upload,
    Tag,
    Channel,
  ],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), 'generated', 'schema.graphql'),
  },
});
