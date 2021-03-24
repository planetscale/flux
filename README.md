## Deploy to Vercel

Use the button below to deploy this project onto your Vercel account.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fplanetscale%2Fflux&env=DB_CONN_DB,DB_CONN_PASSWORD,DB_CONN_USER,DB_CONN_PORT,DB_CONN_HOST,NEXTAUTH_URL,JWT_SECRET&project-name=flux&repository-name=flux)

## Local development

### Install dependencies

```
npm ci
```

### Run dev server

```bash
npx vercel dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## DB migration

This project uses [db-migrate](https://github.com/db-migrate/node-db-migrate) to manage database migrations. You can find the docs [here](https://db-migrate.readthedocs.io/en/latest).

**To create a new migration** `npm run migrate create {MIGRATION_NAME} -- --sql-file`

**To run migrations** `npm run migrate up`
