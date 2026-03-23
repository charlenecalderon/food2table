// Import fastify to create the server
import Fastify from "fastify";
// Import the Prisma plugin to connect to the database and use Prisma client
// Use the ".js" extension to avoid TypeScript errors
import prismaPlugin from "./plugins/prisma.js";
// Import the authentication plugin to protect routes that require authentication
import authenticationPlugin from "./plugins/authentication.js";
// Import users routes that handle user and login information
import userRoutes from "./routes/users.js";
// Import profiles routes that handle user profile information
import profileRoutes from "./routes/profiles.js";
// Import roles routes that handle role control
import rolesRoutes from "./routes/roles.js";
// Import products routes that handle product information
import productRoutes from "./routes/products.js";

// Function to build and configure the Fastify server
export default async function buildServer() {
  // Create a new Fastify server instance
  // login is enabled
  const fastifyApp = Fastify({ logger: true });

  // Register the Prisma plugin to connect to the database and use Prisma client
  // This must be done before registering any routes that use the database
  await fastifyApp.register(prismaPlugin);
  // Register the authentication plugin to protect routes that require authentication
  // This must be done before registering any routes that require authentication
  await fastifyApp.register(authenticationPlugin);
  
  // Register the users routes
  // the prefix option means that all routes in userRoutes will be prefixed with "/users"
  await fastifyApp.register(userRoutes, { prefix: "/users" });
  // Register the profiles routes
  // the prefix option means that all routes in profileRoutes will be prefixed with "/profiles"
  await fastifyApp.register(profileRoutes, { prefix: "/profiles" });
  // Register the products routes
  // the prefix option means that all routes in productRoutes will be prefixed with "/products"
  await fastifyApp.register(productRoutes, { prefix: "/products" });

  // Return the configured Fastify server
  return fastifyApp;
}