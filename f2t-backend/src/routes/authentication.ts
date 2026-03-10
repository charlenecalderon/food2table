// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// quick test
// need to create actual routes for authentication
// just create a test user to make sure that the database connection works
export default async function authenticationRoutes(fastify: FastifyInstance) {
    // display message to show that the route has been loaded
    console.log("Authentication routes loaded");
    
    const user = await fastify.prisma.user.create({
        data: {
            email: "user1@example.com",
            passwordHash: "pass123word"

        }
    });
<<<<<<< HEAD

    // display message to show that the user has been created
    console.log("User created:", user);
}
=======
}
>>>>>>> 0e9ad3f79897808ff18aba90d5c004c32cdf5342
