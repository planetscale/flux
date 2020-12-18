import { objectType, queryType, mutationType, makeSchema } from '@nexus/schema';
import { nexusPrisma } from 'nexus-plugin-prisma';
import path from 'path';

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
    t.model.name();
    t.model.summary();
    t.model.published();
    t.model.tags();
    t.model.author();
    t.model.lens();
    t.model.replies();
    t.model.content();
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

const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.posts();
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
        return ctx.prisma.lens.findMany({});
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
    t.crud.createOneLens();
    t.crud.updateOneLens();
    t.crud.deleteOneLens();
    t.crud.createOnePost();
    t.crud.updateOnePost();
    t.crud.deleteOnePost();
    t.crud.createOneReply();
    t.crud.updateOneReply();
    t.crud.deleteOneReply();
    t.crud.createOneTag();
  },
});

export const schema = makeSchema({
  types: [User, Org, Profile, Lens, Post, Reply, Tag, Query, Mutation],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), 'generated', 'schema.graphql'),
  },
});
