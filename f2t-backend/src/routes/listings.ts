// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Function to register product routes
export default async function listingRoutes(fastify: FastifyInstance) {
    
    // display message to show that the route has been loaded
    console.log("Listing routes loaded");

    // *********************************************************************************
    // route to get list of all products
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering /listings route for getting a list of all products"); 
    
    // fastify.get() function to handle GET requests to the /products route
    fastify.get("/", async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process of getting a list of all products
        try {
            // constant to get the list of all products from the database using Prisma's findMany method
            const listings = await fastify.prisma.product.findMany();

            // display a message in the terminal to indicate that the products were retrieved successfully and show the list of products
            console.log("Listing (all products) retrieved successfully:", listings);

            // return a 200 OK Request status response with a message and the list of retrieved products in the response body
            return reply.status(200).send({
                message: "Listing (all products) retrieved successfully",
                listings,
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
    // route to get a list of the current user's products
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering /listings/my-products route for getting a list of the current user's products");

    // fastify.get() function to handle GET requests to the /products/my-products route, with a preHandler to require authentication
    fastify.get("/my-products", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process of getting a list of the current user's products
        try {
            // if statement to check that the anthenticated user exists
            if (!request.user || !request.user.userId) {
                // display a message in the terminal to indicate missing authentication data
                console.log("Get list of my products failed: Authenticated user information is missing");

                // return a 401 Unauthorized status response with an error message
                return reply.status(401).send({
                    error: "UNAUTHORIZED",
                    message: "User authentication is required to access this resource.",
                });
            }

            // constant to get the list of the current user's products from the database using Prisma's findMany method
            const myListings = await fastify.prisma.product.findMany({
                where: { sellerId: request.user.userId },
            });

            // display a message in the terminal to indicate that the products were retrieved successfully and show the list of products
            console.log("My listings (all my products) retrieved successfully:", myListings);

            // return a 200 OK Request status response with a message and the list of retrieved products in the response body
            return reply.status(200).send({
                message: "My listings (all my products) retrieved successfully",
                myListings,
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
    // route to to get a single product by id
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering /products/:id route for getting a single product by id");

    // fastify.get() function to handle GET requests to the /products/:id route
    fastify.get("/:id", async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process of getting a single product by id
        try {
            // constant to extract the product id from the request parameters
            const params = request.params as { id: string };
            const { id } = params;

            // if statement to check that the id input is not empty
            if (!id) {
                // display a message in the terminal to indicate missing id
                console.log("Get product failed: Product ID input is missing");

                // return a 400 Bad Request response
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Product ID is required.",
                });
            }

            // if statement to check that the id input is of the correct data type
            if (typeof id !== "string") {
                // display a message in the terminal to indicate wrong data type
                console.log("Get product failed: Product ID input is of the wrong data type");

                // return a 400 Bad Request response
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Product ID must be a string.",
                });
            }

            // constant to get the product from the database using Prisma's findUnique method
            const product = await fastify.prisma.product.findUnique({
                where: { id },
            });

            // if statement to check if the product was found, and return a 404 Not Found response if it was not found
            if (!product) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Product not found",
                });
            }

            // display a message in the terminal to indicate that the product was retrieved successfully and show the product details
            console.log("Product retrieved successfully:", product);

            // return a 200 OK Request status response with a message and the retrieved product in the response body
            return reply.status(200).send({
                message: "Product retrieved successfully",
                product,
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