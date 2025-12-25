// import 'dotenv/config'
// import { PrismaMariaDb } from '@prisma/adapter-mariadb'
// import { PrismaClient } from '@/app/generated/prisma/client'

// const adapter = new PrismaMariaDb({
//   host: process.env.DB_HOST!,
//   port: Number(process.env.DB_PORT!),
//   user: process.env.DB_USER!,
//   password: process.env.DB_PASSWORD!,
//   database: process.env.DB_NAME!,
//   connectionLimit: 50,
//   ssl: {
//     rejectUnauthorized: true,
//   },
// })

// const prisma = new PrismaClient({ adapter })
// export { prisma }

import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/app/generated/prisma/client";

const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    connectionLimit: 10, 
    connectTimeout: 30000, 
    acquireTimeout: 60000,
    idleTimeout: 30000,
    ssl: {
      rejectUnauthorized: true,
    },
  });

  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
