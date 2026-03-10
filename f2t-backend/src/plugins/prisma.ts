// Import fastify-plugin helper to get the plugin to work
import fp from "fastify-plugin";

// Import Prisma client constructor
import { PrismaClient } from "@prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}
const adapter = new PrismaPg({ connectionString });
// Export the Fastify plugin
export default fp(async (fastifyApp) => {
  // Create a new Prisma client instance
  const prisma = new PrismaClient({adapter});

  // Connect the prisma client to the database
  await prisma.$connect();

  // Attach the prisma client to the fastifyApp instance
  // Enables access of the prisma client everywhere by using app.prisma
  fastifyApp.decorate("prisma", prisma);

  // When the server gets close, then disconnect the prisma client from the database
  fastifyApp.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});

// Let TypeScript know that fastifyApp has a "prisma" property
// This allows TypeScript to acknowledge "app.prisma" in other files
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;

    
  }
}