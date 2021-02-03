import {
  objectType,
  queryType,
  mutationType,
  makeSchema,
  intArg,
  inputObjectType,
  stringArg,
} from '@nexus/schema';
import { nexusPrisma } from 'nexus-plugin-prisma';
import path from 'path';

const { WebClient } = require('@slack/web-api');

const Org = objectType({
  name: 'Org',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.createdAt();
    t.model.users();
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
    // t.model.posts();
    t.list.field('posts', {
      type: 'Post',
      args: {
        first: intArg(),
        last: intArg(),
        after: UniqueIdInput,
        before: UniqueIdInput,
        tag: stringArg(),
      },
      async resolve(_parent, _args, ctx) {
        const { first, last, after, before, tag } = _args;
        const tagWhereClause = tag
          ? {
              tag: {
                name: tag,
              },
            }
          : undefined;
        // TODO: handle all param existence cases
        // first && after
        // first && before
        // last && after
        // last && before
        if (last && before) {
          // before.id === -1 means start from the last record in table
          if (before.id && before.id === -1) {
            try {
              const res = await ctx.prisma.post.findFirst({
                orderBy: {
                  id: 'desc',
                },
              });

              if (res) {
                const result = await ctx.prisma.post.findMany({
                  take: Math.abs(last),
                  cursor: {
                    id: res.id,
                  },
                  orderBy: {
                    id: 'desc',
                  },
                  where: tagWhereClause,
                });

                return result;
              }
            } catch (error) {
              console.error(error);
            }
          } else if (before.id && before.id !== -1) {
            return ctx.prisma.post.findMany({
              take: Math.abs(last),
              skip: 1,
              cursor: {
                id: before.id,
              },
              orderBy: {
                id: 'desc',
              },
              where: tagWhereClause,
            });
          }
        }

        // default => return all
        return ctx.prisma.post.findMany({ where: tagWhereClause });
      },
    });
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
    t.model.author();
    t.model.replies();
    t.model.content();
    t.model.stars();
    t.model.tag();
  },
});

const Star = objectType({
  name: 'Star',
  definition(t) {
    t.model.id();
    t.model.post();
    t.model.user();
    t.model.reply();
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
    t.model.stars();
  },
});

const UniqueIdInput = inputObjectType({
  name: 'UniqueIdInput',
  definition(t) {
    t.int('id');
  },
});

// Type for retrieving Slack channel names from Slack API.
const Channel = objectType({
  name: 'Channel',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.posts();
  },
});

const SlackMember = objectType({
  name: 'SlackMember',
  definition(t) {
    t.id('id');
    t.string('realName');
    t.string('displayName');
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
        // TODO: check if returns correct number of orgs
        return ctx.prisma.org.findMany();
      },
    });
    t.crud.post();
    t.crud.posts();
    t.list.field('channels', {
      type: 'Channel',
      async resolve(_parent, _args, _ctx) {
        try {
          const slackRes = await client.conversations.list({
            exclude_archived: true,
            limit: 1000,
          });

          return slackRes.channels
            .filter(
              channel =>
                !channel.is_archived &&
                !channel.is_ext_shared &&
                !channel.is_private &&
                !channel.is_org_shared &&
                !channel.is_shared &&
                !channel.name.match('^support-')
            )
            .map(channel => ({
              id: channel.id,
              name: channel.name,
            }));
        } catch (error) {
          console.error(error);
        }
      },
    });
    t.list.field('slackMembers', {
      type: 'SlackMember',
      async resolve(_parent, _args, _ctx) {
        try {
          const slackRes = await client.users.list({});

          return slackRes.members
            .filter(
              member =>
                !member.deleted &&
                !member.is_bot &&
                !member.is_restricted &&
                member.profile.real_name.toLowerCase() !== 'slackbot'
            )
            .map(member => ({
              id: member.id,
              realName: member.profile.real_name,
              displayName: member.profile.display_name,
            }));
        } catch (error) {
          console.error(error);
        }
      },
    });
    t.crud.replies();
    t.crud.tags();
  },
});

const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser();
    t.crud.updateOneUser();
    t.crud.deleteOneUser();
    t.crud.createOneOrg();
    t.crud.updateOneOrg();
    t.crud.deleteOneOrg();
    // t.crud.createOnePost(); is replaced by postUpload().
    t.crud.updateOnePost();
    t.crud.deleteOnePost();
    t.crud.createOneReply();
    t.crud.updateOneReply();
    t.crud.deleteOneReply();
    t.crud.createOneStar();
    t.crud.deleteOneStar();
    t.field('addStar', {
      type: 'Star',
      args: {
        postId: intArg(),
        replyId: intArg(),
        userId: intArg(),
      },
      async resolve(_root, args, ctx) {
        const star = await ctx.prisma.star.findFirst({
          where: {
            postId: args.postId,
            replyId: args.replyId,
            userId: args.userId,
          },
        });

        if (star) {
          console.error('Duplicate stars not permitted on posts.');
          return {};
        }

        const params = {
          data: {
            post: {
              connect: {
                id: args.postId,
              },
            },
            user: {
              connect: {
                id: args.userId,
              },
            },
          },
        };
        if (args.replyId !== null) {
          params.data.reply = {
            connect: {
              id: args.replyId,
            },
          };
        }

        return ctx.prisma.star.create(params);
      },
    });
    t.crud.createOneTag();
    t.crud.deleteOneTag();
  },
});

export const schema = makeSchema({
  types: [
    User,
    Org,
    Profile,
    Post,
    Reply,
    Query,
    Mutation,
    Star,
    Channel,
    Tag,
    SlackMember,
  ],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), 'generated', 'schema.graphql'),
  },
});
