// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// quick test
export default async function authenticationRoutes(fastify: FastifyInstance) {
    const user = await fastify.prisma.user.create({
        data: {
            email: "user@example.com",
            passwordHash: "pass123word"

        }
    });
}