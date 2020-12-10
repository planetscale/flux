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
    t.model.orgId();
    t.model.createdAt();
  },
});

const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.org();
    t.crud.orgs();
  },
});

const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser();
    t.crud.deleteOneUser();
    t.crud.updateOneUser();
  },
});

export const schema = makeSchema({
  types: [User, Org, Query, Mutation],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), 'generated', 'schema.graphql'),
  },
});
