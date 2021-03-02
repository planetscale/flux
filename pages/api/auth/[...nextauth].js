import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      state: false,
    }),
    // ...add more providers here
  ],
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: `mysql://${process.env.DB_CONN_USER}:${process.env.DB_CONN_PASSWORD}@${process.env.DB_CONN_HOST}/${process.env.DB_CONN_DB}`,
});
