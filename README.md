## Flux Private Fork

This is a private fork of https://github.com/planetscale/flux.

### Update repo from upstream
```bash
git fetch upstream
git merge upstream/main
git push
```

It may be worth looking into https://github.com/repo-sync/repo-sync as an automated way of keeping our private repo current.

### Push changed to upstream

This has not been investigated. Perhaps we can include this in our normal workflow. We need to be careful never to leak anything. Currently this process is not prohibited.

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
