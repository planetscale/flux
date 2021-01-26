## Getting Started

### Install dependencies

Please use Node v15 and above, run the following commands

```
npm ci
npx prisma generate
```

### Run dev server

```bash
npx next dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

Please add Dev Environment Variables to `.env.development.local` file.

`NEXT_PUBLIC_ALLOWED_EMAIL_REGEX` - Regex to limit users based on email address to accessing the app. Leave blank to allow all.

`NEXT_PUBLIC_FIRE_API_KEY`, `NEXT_PUBLIC_FIRE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIRE_PROJECT_ID`,`NEXT_PUBLIC_FIRE_STORAGE_BUCKET`,`NEXT_PUBLIC_FIRE_MESSAGING_SENDER_ID`,`NEXT_PUBLIC_FIRE_APP_ID`, `FIRE_ADMIN_KEY`- Firebase project configs.

`SLACK_API_TOKEN` - Slack's web API token to power the slack bot.

`DATABASE_URL` - PlanetScaleDB url.

## Deploy on Vercel

## Tech Debt

Prisma currently does not support [native data types](https://github.com/prisma/prisma/issues/4713). Because of this, the following commands need to be ran against any new database that we set up against this project:

```SQL
ALTER TABLE Reply
MODIFY COLUMN content TEXT;

ALTER TABLE Post
MODIFY COLUMN content TEXT;
```

We need to use `prisma db push` when setting m-n relationships because it sets up [two indexes](https://www.prisma.io/docs/concepts/components/prisma-schema/relations#conventions-for-relation-tables-in-implicit-m-n-relations) behind the scenes that are required for the many to many relationship table to work properly.
