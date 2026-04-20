// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";
// Import path module to handle file paths  
import path from "node:path";
// Import bcrypt to hash passwords before storing them in the database
import bcrypt from "bcrypt";


// Function to register user routes
export default async function userRoutes(fastify: FastifyInstance) {
    // display message to show that the route has been loaded
    console.log("Users routes loaded");

    // constant to create the number of rounds (the cost of processing the data) that bcrypt uses to generate a salt
    // bcrypt uses the rounds to generate a salt (random string) to use in hasing the password
    const saltRounds = 10;
    
    // *********************************************************************************
    // route to create a user
    // *********************************************************************************

    // display a message to show that the route is being registered
    console.log("Registering /user route");

    // fastify.post() function to handle POST requests to the /user route
    fastify.post("", async (request, reply) => {
        // try-catch block to handle any errors that may occur during the user creation process
        try {
            // constant to extract the email and password from the request body
            // Type assertion to specify the expected structure of the request body
            const { email, password } = request.body as {
                email: string;
                password: string;
            };

            // if statement to check that the email and password inputs are not empty
            if (!email || !password) {
                // display a message in the terminal to indicate that the email or password input is missing
                console.log("User creation failed: Email or password input is missing");

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "MISSING INPUT",
                    message: "Email and password are required to create a user.",
                });
            }

            // if statement tocheck that the email and password inputs are of the correct data type (string)
            if (typeof email !== "string" || typeof password !== "string") {
                // display a message in the terminal to indicate that the email or password input is of the wrong data type
                console.log("User creation failed: Email or password input is of the wrong data type");

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "INVALID INPUT",
                    message: "Email and password must be of type string.",
                });
            }

            // check if a user with the same email already exists in the database
            const existingUser = await fastify.prisma.user.findUnique({
                where: { email },
            });

            // if statement to return an error message is a user wiht the same email alreadu exists
            if (existingUser) {
                // display a message in the terminal to indicate that a user with the same email already exists
                console.log(`User creation failed: User with email ${email} already exists`);

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "USER ALREADY EXISTS",
                    message: `A user with the email ${email} already exists. Please choose a different email.`,
                });
            }

            // constant to hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // constant to create a new user in the database using Prisma's create method
            const user = await fastify.prisma.user.create({
                // data object to specify the data for the new user
                data: {
                    email,
                    passwordHash: hashedPassword, // bcrypt implemented to hash the password before storing it in the database
                },
            });

            // display a message in the terminal to indicate that the user was created successfully
            console.log(`User created successfully: ${email}`);

            // return a 201 Created Request status response with a success message and the created user's id and email
            return reply.status(201).send({
                message: "User created successfully",
                user: {
                    id: user.id,
                    email: user.email,},
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
    // route to log in a user
    // *********************************************************************************

    // display a message to show that the route is being registered
    console.log("Registering /login route");

    // fastify.post() function to handle POST requests to the /login route
    fastify.post("/login", async (request, reply) => {
        // try-catch block to handle any errors that may occur during the user login process
        try {
            // constant to extract the email and password from the request body
            // Type assertion to specify the expected structure of the request body
            const { email, password } = request.body as {
                email: string;
                password: string;
            };

            // if statement to check that the email and password inputs are not empty
            if (!email || !password) {
                // display a message in the terminal to indicate that the email or password input is missing
                console.log("User login failed: Email or password input is missing");

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "MISSING INPUT",
                    message: "Email and password are required to log in.",
                });
            }

            // if statement to check that the email and password inputs are of the correct data type (string)
            if (typeof email !== "string" || typeof password !== "string") {
                // display a message in the terminal to indicate that the email or password input is of the wrong data type
                console.log("User login failed: Email or password input is of the wrong data type");

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "INVALID INPUT",
                    message: "Email and password must be of type string.",
                });
            }

            // find the user in the database by email and check if the password is correct
            const user = await fastify.prisma.user.findUnique({
                where: { email },
            });

            // if statement to check if the user was found in the database
            if (!user) {
                // display a message in the terminal to indicate that the user was not found
                console.log(`User login failed: User with email ${email} not found`);

                // return a 404 Not Found status response with an error message
                return reply.status(404).send({
                    error: "USER NOT FOUND",
                    message: `No user found with the email ${email}.`,
                });
            }

            // constant to determine the validity of the original password with the hashed password
            const isValidPassword = await bcrypt.compare(password, user.passwordHash);

            // if statement to check if the password is correct
            if (!isValidPassword) {
                // display a message in the terminal to indicate that the password is incorrect
                console.log(`User login failed: Incorrect password for email ${email}`);

                // return a 401 Unauthorized status response with an error message
                return reply.status(401).send({
                    error: "INVALID PASSWORD",
                    message: "The password you entered is incorrect. Please try again.",
                });
            }

            // if statement to check if the user ID exists before creating a JWT token
            if (!user.id) {
                // display a message in the terminal to indicate that the user id is missing
                console.log(`User login failed: User ID is missing for email ${email}`);

                // return a 500 Internal Server Error status response with an error message
                return reply.status(500).send({
                    error: "INTERNAL SERVER ERROR",
                    message: "User ID is missing. Cannot create JWT token.",
                });
            }

            // create a JWT token with the user's id and roles
            const token = await reply.jwtSign({
                userId: user.id
            });

            // display a message in the terminal to indicate that the user logged in successfully
            console.log(`User logged in successfully: ${email}`);

            // return a 200 OK Request status response with a success message and the logged in user's id, JWT token, and email
            return reply.status(200).send({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                },
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
    // route to get the current logged in user's information
    // *********************************************************************************

    // display a message to show that the route is being registered
    console.log("Registering /me route");

    // fastify.get() function to handle GET requests to the /me route
    fastify.get("/me", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process of getting the current user's information
        try {
            // constant to find the user in the database by the id extracted from the JWT token
            const user = await fastify.prisma.user.findUnique({
                where: { id: request.user.userId },
            });

            // if statement to check if the user information is available in the request object
            if (!user) {
                // display a message in the terminal to indicate that the user information is missing
                console.log("Get current user failed: User information is missing in the request object");

                // return a 404 Unauthorized status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "User information is missing. Please log in to access this resource.",
                });
            }

            // display a message in the terminal to indicate that the current user's information was retrieved successfully
            console.log(`Current user information retrieved successfully: ${user.email}`);

            // return a 200 OK Request status response with the current logged in user's id and email
            return reply.status(200).send({
                user: {
                    id: user.id,
                    email: user.email,
                },
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
    // route to log out a user
    // *********************************************************************************

    // display a message to show that the route is being registered
    console.log("Registering /logout route");

    // fastify.post() function to handle POST requests to the /logout route
    fastify.post("/logout", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the user logout process
        try {
            // constant to get the current user id
            const userId = request.user.userId;

            // display a message in the terminal to indicate that the user logged out successfully
            console.log(`User logged out successfully: ${userId}`);

            // return a 200 OK Request status response with a success message
            return reply.status(200).send({
                message: "Logout successful",
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
    // route to update user pw
    // *********************************************************************************

    // display a message to show that the route is being registered
    console.log("Registering /password route");

    // fastify.patch() function to handle PATCH requests to the /password route
    fastify.patch("/:id/password", async (request, reply) => {
        try {
            // constant to extract the user id from the route parameters
            const params = request.params as { id: string };
            const { id } = params;

            // constant to extract the new password from the request body
            const { password } = request.body as {
                password: string;
            };

            // if statement to check that the id and password inputs are not empty
            if (!id || !password) {
                // display a message in the terminal to indicate that the id or password input is missing
                console.log("User password update failed: User ID or new password input is missing");
                
                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "User ID and new password are required.",
                });
            }

            // if statement to check that the id and password inputs are of the correct data type (string)
            if (typeof id !== "string" || typeof password !== "string") {
                // display a message in the terminal to indicate that the id or password input is of the wrong data type
                console.log("User password update failed: User ID or new password input is of the wrong data type");

                // return a 400 Bad Request status response with an error message
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "User ID and new password must be strings.",
                });
            }

            // check if the user with the specified id exists in the database
            const existingUser = await fastify.prisma.user.findUnique({
                where: { id },
            });

            // if statement to check if the user was found in the database
            if (!existingUser) {
                // display a message in the terminal to indicate that the user was not found
                console.log(`User password update failed: User with ID ${id} not found`);

                // return a 404 Not Found status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: `No user found with the ID ${id}.`,
                });
            }

            // constant to hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // constant to update the user's password in the database using Prisma's update method
            const updatedUser = await fastify.prisma.user.update({
                where: { id },
                data: {
                    passwordHash: hashedPassword, // bcrypt implemented to hash the password before storing it in the database
                },
                select: {
                    id: true,
                    email: true,
                },
            });

            // display a message in the terminal to indicate that the user's password was updated successfully
            console.log(`User password updated successfully for user ID ${id}`);

            // return a 200 OK Request status response with a success message and the updated user's id and email
            return reply.status(200).send({
                message: "User password updated successfully",
                user: updatedUser,
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
    // route to delete a user
    // *********************************************************************************

    // display a message to show that the route is being registered
    console.log("Registering /delete route");

    // fastify.delete() function to handle DELETE requests to the /delete route
    fastify.delete("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        try {
            // constant to get the current user id
            const userId = request.user.userId;

            // check if the user with the specified id exists in the database
            const existingUser = await fastify.prisma.user.findUnique({
                where: { id: userId },
            });

            // if statement to check if the user was found in the database
            if (!existingUser) {
                // display a message in the terminal to indicate that the user was not found
                console.log(`User deletion failed: User with ID ${userId} not found`);

                // return a 404 Not Found status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: `No user found with the ID ${userId}.`,
                });
            }

            // constant to delete the user from the database using Prisma's delete method
            await fastify.prisma.user.delete({
                where: { id: userId },
            });

            // display a message in the terminal to indicate that the user was deleted successfully
            console.log(`User deleted successfully: User ID ${userId}`);

            // return a 200 OK Request status response with a success message
            return reply.status(200).send({
                message: "User deleted successfully",
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

}