import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      name: 'NoAuthEmail',
      credentials: {
        username: { label: 'Email', type: 'text', placeholder: 'jsmith' },
      },
      async authorize(credentials) {
        return credentials.email ? { email: credentials.email } : null;
      },
    }),
    // ...add more providers here
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
