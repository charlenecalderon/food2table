// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// quick test
export default async function authenticationRoutes(fastify: FastifyInstance) {
    // display message to show that the route has been loaded
    console.log("Authentication routes loaded");
    
    const user = await fastify.prisma.user.create({
        data: {
            email: "user1@example.com",
            passwordHash: "pass123word"

        }
    });

    // display message to show that the user has been created
    console.log("User created:", user);
}