// Import fastify-plugin helper to get the plugin to work
import fastifyPlugin from "fastify-plugin";

// Import Prisma client constructor
import { PrismaClient } from "@prisma/client";

// Import PostgreSQL adapter
import { PrismaPg } from "@prisma/adapter-pg";

// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Load varaibles form .env file into process.env
process.loadEnvFile();

// database URL string variable from .env file
const databaseUrl = process.env.DATABASE_URL;

// Display error message if database URL is empty
if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL");
}
// Create PostgreSQL adapter using the database URL from .env file
const adapter = new PrismaPg({ connectionString: databaseUrl });

// Create a new Prisma client instance
  const prisma = new PrismaClient({ adapter });

// Function to export the Fastify plugin
async function prismaPlugin(fastifyApp: FastifyInstance) {
  // Connect the prisma client to the database
  await prisma.$connect();

  // Attach the prisma client to the fastifyApp instance
  // Enables access of the prisma client everywhere by using fastifyApp.prisma
  fastifyApp.decorate("prisma", prisma);

  // Function that disconnects Prisma when the server closes
  async function disconnectPrisma() {
    await prisma.$disconnect();
  }

  // When the server gets close, then disconnect the prisma client from the database
  fastifyApp.addHook("onClose", disconnectPrisma);
};

// Use fastify-plugin to export the prismaPlugin function as a Fastify plugin
export default fastifyPlugin(prismaPlugin);

// Let TypeScript know that fastifyApp has a "prisma" property
// This allows TypeScript to acknowledge "fastifyApp.prisma" in other files
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}