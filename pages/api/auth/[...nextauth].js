import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers here.
  // See https://github.com/planetscale/flux/blob/main/authentication/README.md for more details.
  providers: [
    Providers.Credentials({
      name: 'Email',
      credentials: {
        username: { label: 'Email', type: 'text', placeholder: 'jsmith' },
      },
      async authorize(credentials) {
        return credentials.email ? { email: credentials.email } : null;
      },
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      state: false,
      pages: {
        signIn: '/',
        signOut: '/',
      },
    }),
  ],
  pages: {
    signIn: '/',
    signOut: '/',
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: `mysql://${process.env.DB_CONN_USER}:${process.env.DB_CONN_PASSWORD}@${process.env.DB_CONN_HOST}/${process.env.DB_CONN_DB}`,
});
