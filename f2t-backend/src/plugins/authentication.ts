// Import fastify-plugin helper to get the plugin to work
import fp from "fastify-plugin";

// Add cookie support to Fastify
import cookie from "@fastify/cookie";

// Add JWT support to Fastify
// JWT is a signed token that contains information about the user
import jwt from "@fastify/jwt";

// Export the Fastify plugin
export default fp(async (fastifyApp) => {
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
  fastifyApp.decorate("requireAuth", async (request: any, reply: any) => {
    try {
      // Verify JWT from the request from the cookie
      await request.jwtVerify();
    } catch {
      // If verification fails, return an error message "Unauthorized"
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });
});

// Let TypeScript know that the Fastify app has a "requireAuth" property
// This allows TypeScript to acknowledge "app.requireAuth" in other files
declare module "fastify" {
  interface FastifyInstance {
    requireAuth: any;
  }
}

// Let TypeScript know what the JWT data looks like
// This allows TypeScript to correctly type "req.user" and JWT payloads
declare module "@fastify/jwt" {
  interface FastifyJWT {
    // This is the data we store inside the token
    payload: { userId: string; roles: string[] };

    // This is the data we get on "req.user" after verification
    user: { userId: string; roles: string[] };
  }
}