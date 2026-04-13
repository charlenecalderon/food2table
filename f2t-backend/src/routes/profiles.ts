// new function sample: fastify.wahatever ("/profiles/funtionName
// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// quick test
export default async function profileRoutes(fastify: FastifyInstance) {
    
    // display message to show that the route has been loaded
    console.log("Profile routes loaded");

    // *********************************************************************************
    // route to create a profile
    // *********************************************************************************

    // display a message to show that the route is being registered
    console.log("Registering /new profile route");

    //need to receive input to fill name, location?, and pickupInstructions
    fastify.post("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        try {
            const { name, location, pickupInstructions } = request.body as {
                name: string;
                location: string;
                pickupInstructions: string;
            };

            // if statement to check that the authenticated user information exists
            if (!request.user || !request.user.userId) {
                // display a message in the terminal to indicate missing authentication data
                console.log("Profile creation failed: Authenticated user information is missing");

                // return a 401 Unauthorized status response with an error message
                return reply.status(401).send({
                    error: "UNAUTHORIZED",
                    message: "User authentication is required to create a profile.",
                });
            }

            // if statement to check that the required input is not empty
            if (!name) {
                // display a message in the terminal to indicate that the name input is missing
                console.log("Profile creation failed: Name input is missing");

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "MISSING INPUT",
                    message: "Name is required to create a profile.",
                });
            }

            // if statement to check that the input values are of the correct data type
            if (
                typeof name !== "string" ||
                (location !== undefined && typeof location !== "string") ||
                (pickupInstructions !== undefined && typeof pickupInstructions !== "string")
            ) {
                // display a message in the terminal to indicate that one or more inputs are of the wrong data type
                console.log("Profile creation failed: One or more inputs are of the wrong data type");

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "INVALID INPUT",
                    message: "Name must be a string. Location and pickup instructions must also be strings if provided.",
                });
            }

            // check if a profile already exists for the current autehnticated user
            const existingProfile = await fastify.prisma.profile.findUnique({
                where: { userId: request.user.userId }
            });

            // if statement to check if the profile already exists
            if (existingProfile) {
                // display a message in the terminal to indicate that the profile already exists
                console.log(`Profile creation failed: Profile already exists for user ID ${request.user.userId}`);

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "PROFILE ALREADY EXISTS",
                    message: "A profile already exists for this user.",
                });
            }

            // create the new profile
            const profile = await fastify.prisma.profile.create({
                data: {
                    name,
                    location,
                    pickupInstructions,
                    userId: request.user.userId,// get the id of the currently authenticated user from the request object
                },
            });

            // display a message in the terminal to indicate that the profile was created successfully
            console.log(`Profile created successfully for user ID ${request.user.userId}`);

            // return a 201 Created response with a success message and the created profile
            return reply.status(201).send({
                message: "Profile created successfully",
                profile,
            });
        }
        
        // catch block to handle any errors that may occur during the user creation process
        catch (error) {
            // display the error in the terminal for debugging purposes
            console.error(error);
            // return a 500 Internal Server Error response with an error message if an unexpected error occurs during the user creation process
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred while processing your request.",
            });
        }
    });

    // *********************************************************************************
    //route to update profile name
    // *********************************************************************************

    // display a message to show that the route is being registered
    console.log("Registering /update profile route");

    // fastify.patch() function to handle PATCH requests to the /:id/name route
    fastify.patch("/:id/name", async (request, reply) => {
        try {
            const params = request.params as { id: string };
            const { id } = params;

            const { input } = request.body as {
                input: string; //read in input for new name
            };

            // if statement to check that the id and input are not empty
            if (!id || !input) {
                // display a message in the terminal to indicate that the id or input is missing
                console.log("Profile name update failed: Profile ID or new name input is missing");

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "MISSING INPUT",
                    message: "Profile ID and new name are required.",
                });
            }

            // if statement to check that the id and input are of the correct data type
            if (typeof id !== "string" || typeof input !== "string") {
                // display a message in the terminal to indicate that the id or input is of the wrong data type
                console.log("Profile name update failed: Profile ID or new name input is of the wrong data type");

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "INVALID INPUT",
                    message: "Profile ID and new name must be strings.",
                });
            }

            // check if the profile with the specified id exists in the database
            const existingProfile = await fastify.prisma.profile.findUnique({
                where: { id },
            });

            // if statement to check if the profile exists
            if (!existingProfile) {
                // display a message in the terminal to indicate that the profile was not found
                console.log(`Profile name update failed: Profile with ID ${id} not found`);

                // return a 404 Not Found status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: `No profile found with the ID ${id}.`,
                });
            }

            // update the profile name in the database
            const updatedProfile = await fastify.prisma.profile.update({
                where: { id },
                data: {
                    name: input, // store new name in the profile's name variable
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    location: true,
                    updatedAt: true
                },
            });

            // display a message in the terminal to indicate that the profile name was updated successfully
            console.log(`Profile name updated successfully for profile ID ${id}`);

            // return a 200 OK response with a success message and the updated profile
            return reply.status(200).send({
                message: "Name updated successfully",
                profile: updatedProfile,
            });
        }
        
        // catch block to handle any errors that may occur during the user creation process
        catch (error) {
            // display the error in the terminal for debugging purposes
            console.error(error);
            // return a 500 Internal Server Error response with an error message if an unexpected error occurs during the user creation process
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred while processing your request.",
            });
        }
    });

    // *********************************************************************************
    // route to get the current logged in user's profile information
    // *********************************************************************************

    // display a message to show that the route is being registered
    console.log("Registering /me profile route");

    // fastify.get() function to handle GET requests to the /me route
    fastify.get("/me", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process
        try {
            // display profile information for debugging
            console.log("request.user =", request.user);
            console.log("auth header =", request.headers.authorization);
            // console.log("cookies =", request.cookies);

            // if statement to check that the authenticated user information exists
            if (!request.user || !request.user.userId) {
                // display a message in the terminal to indicate missing authentication data
                console.log("Get current profile failed: Authenticated user information is missing");

                // return a 401 Unauthorized status response with an error message
                return reply.status(401).send({
                    error: "UNAUTHORIZED",
                    message: "User authentication is required to access this resource.",
                });
            }

            // constant to find the current user's profile in the database
            const profile = await fastify.prisma.profile.findUnique({
                where: { userId: request.user.userId },
            });

            // if statement to check if the profile exists
            if (!profile) {
                // display a message in the terminal to indicate that the profile was not found
                console.log(`Get current profile failed: No profile found for user ID ${request.user.userId}`);

                // return a 404 Not Found status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "No profile was found for the current user.",
                });
            }

            // display a message in the terminal to indicate that the profile was retrieved successfully
            console.log(`Current profile retrieved successfully for user ID ${request.user.userId}`);

            // return a 200 OK response with the profile information
            return reply.status(200).send({
                message: "Current profile retrieved successfully",
                profile,
            });
        }

        // catch block to handle any errors that may occur during the process
        catch (error) {
            // display the error in the terminal for debugging purposes
            console.error(error);

            // return a 500 Internal Server Error response with an error message
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred while processing your request.",
            });
        }
    });
}