import buildServer from "./buildServer.js";

const fastifyApp = await buildServer();

await fastifyApp.listen({ port: 3000, host: "0.0.0.0" });