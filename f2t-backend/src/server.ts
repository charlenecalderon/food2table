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
