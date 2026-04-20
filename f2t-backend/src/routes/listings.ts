// Import the Fastify type so TypeScript understands the fastify object
import type { Product } from "@prisma/client";
import type { FastifyInstance } from "fastify";

// Function to register listing routes
export default async function listingRoutes(fastify: FastifyInstance) {
    
    // display message to show that the route has been loaded
    console.log("Listing routes loaded");
    
    // *********************************************************************************
    // route to create a listing
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering new /listings route for creating a listing");

    // fastify.post() function to handle POST requests to the /listings route, with a preHandler to require authentication
    fastify.post("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the listing creation process
        try {
            // if statement to check that the anthenticated user exists
            if (!request.user || !request.user.userId) {
                // display a message in the terminal to indicate missing authentication data
                console.log("Get my products failed: Authenticated user information is missing");

                // return a 401 Unauthorized status response with an error message
                return reply.status(401).send({
                    error: "UNAUTHORIZED",
                    message: "User authentication is required to access this resource.",
                });
            }
            //get currently logged in user's id from the request object and store it in a constant called userId
            const userId = request.user.userId;
            // constant to extract the title, description, and productId from the request body
            const { title, description, price, productId, quantity } = request.body as {
                title: string;
                description: string;
                price: number;
                productId: string[];
                quantity: number[];
            };
            //INPUT VALIDATION SECTION

            //NEEDS INPUT VALIDATION. ESPECIALLY MAKE SURE PRODUCTID AND QUANTITY ARE SAME LENGTH

            //make sure all necessary data was provided in request body
            if(!(title&&description&&price&&productId&&quantity)) {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Missing Input. title, description, price, productIds, and quantities must all be included"
                });
            }

            //make sure all data is the correct data type
            if(typeof title!=="string"||
               typeof description!=="string"||
               typeof price!=="number"||
               typeof productId[0]!=="string"||
               typeof quantity[0]!=="number") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Incorrect data types in request body. title, description, and productIds must be strings, and price and quantity are numbers."
                });
            }

            //Make sure productId[] and quantity[] have same number of elements
            if (productId.length !== quantity.length) {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "productId and quantity arrays must have the same length."
                });
            }

            //Now we need to make sure there are enough of each product for desired listing.
            //call all desired products from the database
            // 1. Fetch ALL products that match ANY of the IDs in the array in one single query
            const products: Product[] = await fastify.prisma.product.findMany({
                where: { id: { in: productId, },}, //in function pulls all products with the ids contained in productId[], skips over nonexisting products
            });

            // 2. Check if all products were found
            if (products.length !== productId.length) {
                return reply.status(400).send({ error: "One or more products were not found in the database." });
            }

            //Make sure there is enough of each product to create desired listing
            let isAvailable = true;
            for(let i = 0; i < productId.length; i++) {
                if(products[i].stock < quantity[i]) isAvailable = false;
            }

            // constant to create a new listing in the database using Prisma's create method
            const listing = await fastify.prisma.listing.create({
                // data object to specify the data for the new listing
                data: {
                    title,
                    description,
                    price,
                    products: {create: productId.map((id) => ({productId: id })),}, //map function handles all productId array elements for us
                    quantity,
                    isAvailable,
                    sellerId: userId,
                },
            });

            // display a message in the terminal to indicate that the listing was created successfully and show the listing details
            console.log("Listing created successfully:", listing);

            // return a 201 Request Created statusresponse with a message and the created listing in the response body
            return reply.status(201).send({
                message: "Listing created successfully",
                listing,
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
    // route to edit a listing
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering edit /listings route for creating a listing");

    // fastify.post() function to handle POST requests to the /listings route, with a preHandler to require authentication
    fastify.patch("/:id", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the listing creation process
        try {
            //pull listing id from request params and store it in a constant called id
            const params = request.params as { id: string };
            const { id } = params;

            // constant to extract the title, description, and productId from the request body
            const { title, description, price, productId, quantity } = request.body as {
                title?: string;
                description?: string;
                price?: number;
                productId?: string[];
                quantity?: number[];
            };

            // boolean to indicate whether there are enough of each product
            let isAvailable: boolean = true;

            //NEEDS INPUT VALIDATION. ESPECIALLY MAKE SURE PRODUCTID AND QUANTITY HAVE SAME LENGTH

            //make sure at least one variable was filled with data
            if(!(title===undefined||description===undefined||price===undefined||productId===undefined||quantity===undefined)) {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Please include data for listing attribute you wish to edit",
                });
            }

            //make sure all data is the correct data type
            if(title&&typeof title!=="string") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Incorrect data types in title. Must be a string."
                });
            }

            if(description&&typeof description!=="string") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Incorrect data types in description. Must be a string."
                });
            }

            if(price&&typeof price!=="number") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Incorrect data types in price. Must be a number."
                });
            }

            if(productId&&typeof productId[0]!=="string") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Incorrect data types in productId. Must be array of strings."
                });
            }

            if(quantity&&typeof quantity[0]!=="number") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Incorrect data types in quantity. Must be array of numbers."
                });
            }

            //if updating userId/quantity, make sure both arrays are same length
            if((productId&&quantity)&&productId.length !== quantity.length) {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "productId and quantity arrays must have same number of elements."
                });
            }

            // check if the listing with the specified id exists in the database
            const existingListing = await fastify.prisma.listing.findUnique({
                where: { id },
            });

            // if statement to check if the listing exists
            if (!existingListing) {
                // display a message in the terminal to indicate that the listing was not found
                console.log(`Listing update failed: Listing with ID ${id} not found`);

                // return a 404 Not Found status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: `No listing found with the ID ${id}.`,
                });
            }

            // Verify that the logged in user owns the listing
            if (existingListing.sellerId !== request.user.userId) {
                return reply.status(403).send({
                    error: "ACCESS FORBIDDEN",
                    message: "You are not allowed to update this listing."
                });
            }

            //if editing productId or quantity, ALL productIds and quantities for entire listing must be included
            if((productId&&!quantity)||(!productId&&quantity)) {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "If you are changing productId or quantity, you must reinput all of both for whole listing."
                });
            }

            //If products in listing are being updated, we need to make sure there are enough of each product for desired listing.
            if (productId) {
                //We need to make sure there are enough of each product for desired listing.
                // 1. Fetch ALL products that match ANY of the IDs in the array in one single query
                const products: Product[] = await fastify.prisma.product.findMany({
                    where: { id: { in: productId, },}, //in function pulls all products with the ids contained in productId[], skips over nonexisting products
                });

                // 2. Check if all products were found
                if (products.length !== productId.length) {
                    return reply.status(400).send({ error: "One or more products were not found in the database." });
                }

                //Make sure there is enough of each product to create desired listing
                let isAvailable = true;
                for(let i = 0; i < productId.length; i++) {
                    if(products[i].stock < quantity[i]) isAvailable = false;
                }
            }

            // update the data in the database
            const listing = await fastify.prisma.listing.update({
                // data object to specify the data for the new listing
                where: {id},
                data: {
                    title,
                    description,
                    price,
                    quantity,
                    isAvailable,
                    //if updating products and/or quantity, delete old database relations in join table and create new ones
                    products: productId? {deleteMany: {}, create: productId.map((id) => ({ productId: id })),} : undefined,
                }
            });

            // display a message in the terminal to indicate that the listing was updated successfully and show the listing details
            console.log("Listing updated successfully:", listing);

            // return a 200 OK statusresponse with a message and the updated listing in the response body
            return reply.status(200).send({
                message: "Listing updated successfully",
                listing,
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
    // route to get list of all listings
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering /listings route for getting a list of all listings"); 
    
    // fastify.get() function to handle GET requests to the /listings route
    fastify.get("/", async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process of getting a list of all listings
        try {
            // constant to get the list of all listings from the database using Prisma's findMany method
            const listings = await fastify.prisma.listing.findMany();

            // display a message in the terminal to indicate that the listings were retrieved successfully and show the list of listings
            console.log("Listings retrieved successfully:", listings);

            // return a 200 OK Request status response with a message and the list of retrieved listings in the response body
            return reply.status(200).send({
                message: "Listings retrieved successfully",
                listings,
            });
        }

        // catch block to handle any errors that may occur during the process
        catch (error) {
            // display the error in the terminal for debugging purposes
            console.error(error);
            // return a 500 Internal Server Error response with an error message if an unexpected error occurs during the process
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred while processing your request.",
            });
        }
    });

    // *********************************************************************************
    // route to get all of a vendor's listings by vendor id
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering route for getting a list of a vendor's listings by vendor id");

    // fastify.get() function to handle GET requests to the /listings/my-listings route, with a preHandler to require authentication
    fastify.get("/vendorlistings/:id", async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process of getting a list of the current user's listings
        try {
            //extract vendor id from url
            const params = request.params as { id: string };
            const { id } = params;

            // constant to get the list of the desired vendor's listings from the database using Prisma's findMany method
            const listings = await fastify.prisma.listing.findMany({
                where: { sellerId: id },
            });

            // display a message in the terminal to indicate that the listings were retrieved successfully and show the list of listings
            console.log("Listings retrieved successfully:", listings);

            // return a 200 OK Request status response with a message and the list of retrieved listings in the response body
            return reply.status(200).send({
                message: "Listings retrieved successfully",
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
    // route to to get a single listing by id
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering /listings/:id route for getting a single listing by id");

    // fastify.get() function to handle GET requests to the /listings/:id route
    fastify.get("/:id", async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process of getting a single listing by id
        try {
            // constant to extract the listing id from the request parameters
            const params = request.params as { id: string };
            const { id } = params;

            // if statement to check that the id input is not empty
            if (!id) {
                // display a message in the terminal to indicate missing id
                console.log("Get listing failed: Listing ID input is missing");

                // return a 400 Bad Request response
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Listing ID is required.",
                });
            }

            // if statement to check that the id input is of the correct data type
            if (typeof id !== "string") {
                // display a message in the terminal to indicate wrong data type
                console.log("Get listing failed: Listing ID input is of the wrong data type");

                // return a 400 Bad Request response
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Listing ID must be a string.",
                });
            }

            // constant to get the listing from the database using Prisma's findUnique method
            const listing = await fastify.prisma.listing.findUnique({
                where: { id },
            });

            // if statement to check if the listing was found, and return a 404 Not Found response if it was not found
            if (!listing) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Product not found",
                });
            }

            // display a message in the terminal to indicate that the listing was retrieved successfully and show the listing details
            console.log("Listing retrieved successfully:", listing);

            // return a 200 OK Request status response with a message and the retrieved listing in the response body
            return reply.status(200).send({
                message: "Listing retrieved successfully",
                listing,
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
    // route to delete a listing
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering /listings/:id route for deleting a listing");

    // fastify.delete() function to handle DELETE requests to the /listings/:id route, with a preHandler to require authentication
    fastify.delete("/:id", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the listing deletion process
        try {
            // constant to extract the id from the request parameters
            const { id} = request.params as { id: string};
            const userId = request.user.userId;

            // constant to finc the listing by id
            const existingListing = await  fastify.prisma.listing.findUnique({
                where: { id },
            });

            // if statement to check if the listing exists
            if (!existingListing) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Listing not found.",
                });
            }

            // Verify that the logged in user owns the listing
            if (existingListing.sellerId !== userId) {
                return reply.status(403).send({
                    error: "ACCESS FORBIDDEN",
                    message: "You are not allowed to delete this listing."
                });
            }

            // delete the listing from the database using Prisma's delete method
            await fastify.prisma.listing.delete({
                where: { id },
            });

            // display a message in the terminal to indicate that the listing was deleted successfully
            console.log("Listing deleted successfully:", id);

            // return a 200 OK Request status response with a message indicating that the listing was deleted successfully
            return reply.status(200).send({
                message: "Listing deleted successfully",
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