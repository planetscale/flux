## Getting Started

### Install dependencies

```
npm ci
```

### Run dev server

```bash
npx vercel dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## DB Migration

This project uses [db-migrate](https://github.com/db-migrate/node-db-migrate) to manage database migrations. You can find the docs [here](https://db-migrate.readthedocs.io/en/latest).

**To create a new migration**
`npm run migrate create {MIGRATION_NAME} -- --sql-file`

**To run migrations** `npm run migrate up`
