import buildServer from "./buildServer.js";

const fastifyApp = await buildServer();
// start the server and listen on port 3001 for request
// the "0.0.0.0" address allows the server to accept requests from any IP address
await fastifyApp.listen({ port: 3001, host: "0.0.0.0" });
