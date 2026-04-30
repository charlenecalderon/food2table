import Fastify from "fastify";
// Use the ".js" extension to avoid TypeScript errors
import prismaPlugin from "./plugins/prisma.js";
// Import the authentication plugin to protect routes that require authentication
import authenticationPlugin from "./plugins/authentication.js";
import userRoutes from "./routes/users.js";
import profileRoutes from "./routes/profiles.js";
import rolesRoutes from "./routes/roles.js";
import productRoutes from "./routes/products.js";
// Import listings routes that handle listing information
import listingRoutes from "./routes/listings.js";
// Import orders routes that handle order information
import cartRoutes from "./routes/carts.js";
// Import orders routes that handle order information
import orderRoutes from "./routes/orders.js";
// Import order Items routes that handle order item information
import orderItemRoutes from "./routes/orderItems.js";
//Import dailySchedules route that handles the creation of vendor pickup times
import dailyScheduleRoutes from "./routes/dailySchedules.js";
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
        origin: true,
        methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true
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
  // Register the dailySchedules routes
  // the prefix option means that all routes in dailyScheduleRoutes will be prefixed with "/dailySchedules"
  await fastifyApp.register(dailyScheduleRoutes, { prefix: "/dailySchedules" });
  // Register the products routes
  await fastifyApp.register(productRoutes, { prefix: "/products" });
  // Register the listing routes
  // the prefix option means that all routes in listingRoutes will be prefixed with "/listings"
  await fastifyApp.register(listingRoutes, { prefix: "/listings" });
  // Register the carts routes
  // the prefix option means that all routes in cartRoutes will be prefixed with "/cartss"
  await fastifyApp.register(cartRoutes, { prefix: "/carts" });
  // Register the order routes
  // the prefix option means that all routes in orderRoutes will be prefixed with "/orders"
  await fastifyApp.register(orderRoutes, { prefix: "/orders" });
  // Register the order items routes
  // the prefix option means that all routes in orderItemRoutes will be prefixed with "/orderItems"
  await fastifyApp.register(orderItemRoutes, { prefix: "/orderItems" });

  await fastifyApp.register(rolesRoutes, { prefix: "/roles" });

  // Return the configured Fastify server
  return fastifyApp;
}