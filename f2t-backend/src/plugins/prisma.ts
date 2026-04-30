import fastifyPlugin from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import type { FastifyInstance } from "fastify";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({ connectionString, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter });

async function prismaPlugin(fastifyApp: FastifyInstance) {
  await prisma.$connect();

  fastifyApp.decorate("prisma", prisma);

  fastifyApp.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}

export default fastifyPlugin(prismaPlugin);

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}