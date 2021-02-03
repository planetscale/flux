import { PrismaClient } from '@prisma/client';

let prisma;

// https://github.com/prisma/prisma/discussions/4399
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // adding prismaClient to global object for local dev env
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export function createContext({ req }) {
  return { prisma, req };
}
