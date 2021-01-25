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
Please add Dev Environment Variables to `.env.development` file


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
