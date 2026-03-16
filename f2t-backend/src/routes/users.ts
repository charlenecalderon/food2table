// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Function to register user routes
export default async function userRoutes(fastify: FastifyInstance) {
    // display message to show that the route has been loaded
    console.log("Users routes loaded");
    
    // route to create a user
    fastify.post("/", async (request, reply) => {
        try {
            const { email, password } = request.body as {
                email: string;
                password: string;
            };

            // create a new user in the database
            const user = await fastify.prisma.user.create({
                data: {
                    email,
                    passwordHash: password, // bcrypy will be applied later to hash the password before storing it in the database
                },
            });

            // return a success response with the created user
            return reply.status(201).send({
                message: "User created successfully",
                user: {
                    id: user.id,
                    email: user.email,},
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
            });
        }
    });

}