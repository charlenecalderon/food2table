// Import the buildServer function to create and configure the Fastify server
import buildServer from "./buildServer.js";

// Build the server
const fastifyApp = await buildServer();
// start the server and listen on port 3000 for request
// the "0.0.0.0" address allows the server to accept requests from any IP address
await fastifyApp.listen({ port: 3001, host: "0.0.0.0" });