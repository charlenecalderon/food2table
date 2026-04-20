import Fastify from "fastify";
// Use the ".js" extension to avoid TypeScript errors
import prismaPlugin from "./plugins/prisma.js";
// Import the authentication plugin to protect routes that require authentication
import authenticationPlugin from "./plugins/authentication.js";
import userRoutes from "./routes/users.js";
import profileRoutes from "./routes/profiles.js";
import rolesRoutes from "./routes/roles.js";
import productRoutes from "./routes/products.js";
import cors from '@fastify/cors';

// Function to build and configure the Fastify server
export default async function buildServer() {
  // Create a new Fastify server instance
  // login is enabled
  const fastifyApp = Fastify({ 
	  logger: true,
	  ignoreTrailingSlash: true
  });

  await fastifyApp.register(cors, {
        origin: "http://localhost:3000",
        methods: ["POST", "GET"]
  });

  // Register the Prisma plugin to connect to the database and use Prisma client
  // This must be done before registering any routes that use the database
  await fastifyApp.register(prismaPlugin);
  // Register the authentication plugin to protect routes that require authentication
  // This must be done before registering any routes that require authentication
  await fastifyApp.register(authenticationPlugin);
  
  // Register the users routes
  await fastifyApp.register(userRoutes, { prefix: "/users" });
  // Register the profiles routes
  await fastifyApp.register(profileRoutes, { prefix: "/profiles" });
  // Register the products routes
  await fastifyApp.register(productRoutes, { prefix: "/products" });

  await fastifyApp.register(rolesRoutes, { prefix: "/roles" });

  // Return the configured Fastify server
  return fastifyApp;
}