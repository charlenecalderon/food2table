// Import fastify to create the server
import Fastify from "fastify";
// Import the Prisma plugin to connect to the database and use Prisma client
// Use the ".js" extension to avoid TypeScript errors
import prismaPlugin from "./plugins/prisma.js";
// Import authentication routes that handle user and login information
import authenticationRoutes from "./routes/authentication.js";
// Import profile routes that handle user profile information
import profileRoutes from "./routes/profile.js";
// Import role routes that handle role control
import rolesRoutes from "./routes/roles.js";

// Function to build and configure the Fastify server
async function buildServer() {
  // Create a new Fastify server instance
  // login is enabled
  const fastifyApp = Fastify({ logger: true });

  // Register the Prisma plugin to connect to the database and use Prisma client
  // This must be done before registering any routes that use the database
  await fastifyApp.register(prismaPlugin);
  
  // Register the authentication routes
  // the prefix option means that all routes in authenticationRoutes will be prefixed with "/authentication"
  await fastifyApp.register(authenticationRoutes, { prefix: "/authentication" });
  
  // Return the configured Fastify server
  return fastifyApp;
}

// Build the server
const fastifyApp = await buildServer();
// start the server and listen on port 3000 for request
// the "0.0.0.0" address allows the server to accept requests from any IP address
await fastifyApp.listen({ port: 3000, host: "0.0.0.0" });
