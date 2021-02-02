import { PrismaClient } from '@prisma/client';

let prisma;

const clientParams = {
  log: [
    /*{ emit: 'event', level: 'query' }*/
  ],
};

// https://github.com/prisma/prisma/discussions/4399
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(clientParams);
} else {
  // adding prismaClient to global object for local dev env
  if (!global.prisma) {
    global.prisma = new PrismaClient(clientParams);
  }

  prisma = global.prisma;
}

prisma.$on('query', e => {
  e.timestamp;
  e.query;
  e.params;
  e.duration;
  e.target;
  console.log(e);
});

export function createContext({ req }) {
  return { prisma, req };
}
