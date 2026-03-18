// Import fastify-plugin helper to get the plugin to work
import fastifyPlugins from "fastify-plugin";

// Add cookie support to Fastify
import cookie from "@fastify/cookie";

// Add JWT support to Fastify
// JWT is a signed token that contains information about the user
import jwt from "@fastify/jwt";

// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Create an authentication Plugin function so that we can use in fastifyPlugins
async function authenticationPlugin(fastifyApp: FastifyInstance) {
  // Read secret keys from environment (.env) variables
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const COOKIE_SECRET_KEY = process.env.COOKIE_SECRET_KEY;

  // Display error message if either secret key is empty
  if (!JWT_SECRET_KEY || !COOKIE_SECRET_KEY) throw new Error("Missing JWT_SECRET_KEY or COOKIE_SECRET_KEY");

  // Add the cookie plugin support to the server
  // COOKIE_SECRET_KEY is used to sign cookies
  // Continue until the cookie support is fully loaded
  await fastifyApp.register(cookie, { secret: COOKIE_SECRET_KEY });

  // Add the JWT plugin support to the server
  // JWT_SECRET_KEY is used to sign and verify JWT tokens
  // Continue until the JWT support is fully loaded
  await fastifyApp.register(jwt, { secret: JWT_SECRET_KEY,
    // Configure JWT tokens to be stored in a signed cookie named "session"
    cookie: { cookieName: "session", signed: true },
  });

  // Add a new method that checks for authentication
  async function requireAuth(request: any, reply: any) {
    try {
      // Verify JWT from the request cookie
      await request.jwtVerify();
    } catch {
      // If verification fails return unauthorized
      return reply.code(401).send({ error: "Unauthorized" });
    }
  }

  // Attach the requireAuth method to the fastifyApp instance
  // This allows us to use fastifyApp.requireAuth() in our routes to protect them with authentication
  fastifyApp.decorate("requireAuth", requireAuth);
}

// Export the Fastify plugin
export default fastifyPlugins(authenticationPlugin);

// This tells TypeScript that the Fastify server instance includes a
// "requireAuth" function added by this plugin.
declare module "fastify" {
  interface FastifyInstance {
    requireAuth: any;
  }
}

// This tells TypeScript what data exists inside the JWT token
// and what data will appear on request.user after verification.
declare module "@fastify/jwt" {
  interface FastifyJWT {
    // This is the data we store inside the token
    payload: { userId: string};

    // This is the data available on request.user after jwtVerify() succeeds
    user: { userId: string};
  }
}