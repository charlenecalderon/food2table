// Import fastify-plugin helper to get the plugin to work
<<<<<<< HEAD
import fp from "fastify-plugin";
=======
import fastifyPlugin from "fastify-plugin";
>>>>>>> juan

// Import Prisma client constructor
import { PrismaClient } from "@prisma/client";

<<<<<<< HEAD
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

=======
// Import PostgreSQL adapter
import { PrismaPg } from "@prisma/adapter-pg";

// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Load varaibles form .env file into process.env
process.loadEnvFile();

// database URL sting variable from .env file
const databaseUrl = process.env.DATABASE_URL;

// Display error message if database URL is empty
if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL");
}
// Create PostgreSQL adapter using the database URL from .env file
const adapter = new PrismaPg({ connectionString: databaseUrl });

// Create a new Prisma client instance
  const prisma = new PrismaClient({ adapter });

// Export the Fastify plugin
async function prismaPlugin(fastifyApp: FastifyInstance) {
>>>>>>> juan
  // Connect the prisma client to the database
  await prisma.$connect();

  // Attach the prisma client to the fastifyApp instance
<<<<<<< HEAD
  // Enables access of the prisma client everywhere by using app.prisma
=======
  // Enables access of the prisma client everywhere by using fastifyApp.prisma
>>>>>>> juan
  fastifyApp.decorate("prisma", prisma);

  // When the server gets close, then disconnect the prisma client from the database
  fastifyApp.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
<<<<<<< HEAD
});

// Let TypeScript know that fastifyApp has a "prisma" property
// This allows TypeScript to acknowledge "app.prisma" in other files
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;

    
=======
};

// Use fastify-plugin to export the prismaPlugin function as a Fastify plugin
export default fastifyPlugin(prismaPlugin);

// Let TypeScript know that fastifyApp has a "prisma" property
// This allows TypeScript to acknowledge "fastifyApp.prisma" in other files
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
>>>>>>> juan
  }
}