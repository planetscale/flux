import { rule, shield } from 'graphql-shield';
import { decodeToken } from '../utils/auth/serverConfig';

const rules = {
  isAuthenticatedUser: rule()(async (parent, args, ctx) => {
    const authHeader = ctx.req.headers.authorization;
    let token = '';
    let decodedToken = '';

    if (authHeader?.startsWith('Bearer ')) {
      const tokenArray = authHeader.split(' ');
      // extract the JWT, tokenArray[0] is 'Bearer '
      token = tokenArray[1];

      try {
        decodedToken = await decodeToken(token);
      } catch (e) {
        console.error('Decode token error: ', e);
      }
    }

    return (
      Boolean(decodedToken.uid) &&
      Boolean(
        decodedToken.email.match(
          new RegExp(process.env.NEXT_PUBLIC_ALLOWED_EMAIL_REGEX)
        )
      )
    );
  }),
};

export const permissions = shield(
  {
    // change rules in this object for specific Queries/Mutations
    Query: {
      // currentUser: rules.isAuthenticatedUser,
    },
    Mutation: {
      // deleteUsers: rules.isAuthenticatedUser,
    },
  },
  {
    // fallback rule is applied to all Queries/Mutations by default
    fallbackRule: rules.isAuthenticatedUser,
    // TODO: set env var to toggle debug mode
    debug: true,
  }
);
