// Import fastify-plugin helper to get the plugin to work
import fastifyPlugins from "fastify-plugin";

// Add JWT support to Fastify
// JWT is a signed token that contains information about the user
import jwt from "@fastify/jwt";

// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

// Create an authentication Plugin function so that we can use in fastifyPlugins
async function authenticationPlugin(fastifyApp: FastifyInstance) {
  // Read secret keys from environment (.env) variables
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  // const COOKIE_SECRET_KEY = process.env.COOKIE_SECRET_KEY;

  // Display error message if either secret key is empty
  if (!JWT_SECRET_KEY /*|| !COOKIE_SECRET_KEY*/) {
     throw new Error("Missing JWT_SECRET_KEY");
  }

  // Add the JWT plugin support to the server
  // JWT_SECRET_KEY is used to sign and verify JWT tokens
  // Continue until the JWT support is fully loaded
  await fastifyApp.register(jwt, {
    secret: JWT_SECRET_KEY,
  });

  // Add a new method that checks for authentication
  async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Temporary debug logs so we can see what is happening
      console.log("requireAuth -> authorization header:", request.headers.authorization);

      // Get the authorization header from the request
      const authenticationHeader = request.headers.authorization;

      // check if the authorization header is missing
      if (!authenticationHeader) {
        return reply.code(401).send({
          error: "Unauthorized",
          message: "Authorization header is missing."
        })
      }

      // split the authorization header into parts
      // Expect format: Bearer <token>
      const parts = authenticationHeader.split(" ");

      // Validate the authorization header format
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return reply.code(401).send({
          error: "Unauthorized",
          message: "Authorization header format is invalid.",
        })
      }

      // Verify JWT from the authorization header token
      await request.jwtVerify();

      // Show the user loaded from the JWT after verification succeeds
      console.log("requireAuth -> authenticated user:", request.user);
    }
    
    // catch block to handle any errors that may occur during authentication
    catch (error) {
      // display the error in the terminal for debugging purposes
      console.error("requireAuth -> authentication failed:", error);

      // If verification fails return unauthorized
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Authentication failed or session is missing/invalid.",
      });
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
    requireAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
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