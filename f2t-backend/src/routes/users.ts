// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Function to register user routes
export default async function userRoutes(fastify: FastifyInstance) {
    // display message to show that the route has been loaded
    console.log("Users routes loaded");
    
    // route to create a user
    console.log("Registering /new user route");
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

    // route to log in a user
    console.log("Registering /login route");
    fastify.post("/login", async (request, reply) => {
        try {
            const { email, password } = request.body as {
                email: string;
                password: string;
            };

            // find the user in the database by email and check if the password is correct
            const user = await fastify.prisma.user.findUnique({
                where: { email },
            });

            // return an error response if the user is not found or the password is incorrect
            if (!user) {
                return reply.status(404).send({
                    error: "USER NOT FOUND",
                });
            }

            // create a JWT token with the user's id and roles
            const token = await reply.jwtSign({
                userId: user.id
            });

            // store the token inside the signed "session" cookie
            reply.setCookie("session", token, {
                path: "/",
                httpOnly: true,
                signed: true,
            });

            // return a success response if the user is found and the password is correct
            return reply.status(200).send({
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                },
            });

            // If the password is correct, generate a JWT token or perform other authentication logic
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
            });
        }
    });


    // route to update user pw
    console.log("Registering /password route");
    fastify.patch("/:id/password", async (request, reply) => {
        try {
            const params = request.params as { id: string };
            const { id } = params;

            const { password } = request.body as {
                password: string;
            };

            const updatedUser = await fastify.prisma.user.update({
                where: { id },
                data: {
                    passwordHash: password, // hash later if bcrypt is added
                },
                select: {
                    id: true,
                    email: true,
                },
            });

            return reply.status(200).send({
                message: "User password updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
            });
        }
    });
}