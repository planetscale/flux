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

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
});
