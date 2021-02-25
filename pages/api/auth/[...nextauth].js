import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId:
        '456840210561-jofnfkvqhjuqghukltmknsf6gsne74ft.apps.googleusercontent.com',
      clientSecret: 'wDprrRAfuJeUld6ezUb-vawv',
    }),
    Providers.GitHub({
      clientId:
        '456840210561-jofnfkvqhjuqghukltmknsf6gsne74ft.apps.googleusercontent.com',
      clientSecret: 'wDprrRAfuJeUld6ezUb-vawv',
    }),
    // ...add more providers here
  ],
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  // A database is optional, but required to persist accounts in a database
  database: 'mysql://admin:12341234@34.83.19.255/testdb1',
});
