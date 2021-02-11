## Getting Started

### Install dependencies

Please use Node v15 and above, run the following commands

```
npm ci
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

## DB Migration

This project uses [db-migrate](https://github.com/db-migrate/node-db-migrate) to manage database migrations. You can find the docs [here](https://db-migrate.readthedocs.io/en/latest).

**To create a new migration**
`npm run migrate create {MIGRATION_NAME} -- --sql-file`

**To run migrations**
`npm run migration up`
