import Fastify from "fastify";
import registerRoles from "./routes/roles.js";
import prisma from "./plugins/prisma.js";

const fastify = Fastify({ logger: true });
async function start() {
  try {
    await fastify.register(prisma);
    await fastify.register(registerRoles);
    await fastify.listen({ port: 3001, host: "0.0.0.0" });

    console.log("Server running on local host 3001");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

start();