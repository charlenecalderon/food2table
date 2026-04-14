// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Function to register product routes
export default async function productRoutes(fastify: FastifyInstance) {
    
    // display message to show that the route has been loaded
    console.log("Product routes loaded");
    
    // *********************************************************************************
    // route to create a product
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering new /products route for creating a product");

    // fastify.post() function to handle POST requests to the /products route, with a preHandler to require authentication
    fastify.post("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // constant to extract the name, description, price, and stock from the request body
            // Type assertion to specify the expected structure of the request body
            const { name, description, price, stock } = request.body as {
                name: string;
                description: string;
                price: number;
                stock: number;
            };

            //Input validation to make sure name, description, price and stock are not blank
            if(!name||!description||!price||!stock)
            {
                console.log("ERROR: Missing arguments. Name, description, price, and stock are required.")
                return reply.status(400).send({
                    error:"MISSING INPUT",
                    message:"Name, description, price and stock cannot be blank."
                });
            }

            //Input validation to make sure name and description are strings, and price and stock are numbers
            if(typeof name!=="string"||typeof description!=="string"||typeof price!=="number"||typeof stock!=="number")
            {
                console.log("ERROR: INVALID DATATYPE");
                return reply.status(400).send({
                    error: "INVALID INPUT",
                    message: "Name and description must be strings, and price and stock must be numbers"
                });
            }

            // constant to create a new product in the database using Prisma's create method
            const product = await fastify.prisma.product.create({
                // data object to specify the data for the new product
                data: {
                    name,
                    description,
                    price,
                    stock,
                    sellerId: request.user.userId, // get the id of the currently authenticated user from the request object
                },
            });

            // display a message in the terminal to indicate that the product was created successfully and show the product details
            console.log("Product created successfully:", product);

            // return a 201 Request Created statusresponse with a message and the created product in the response body
            return reply.status(201).send({
                message: "Product created successfully",
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

    // *********************************************************************************
    // route to get list of all products
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering /products route for getting a list of all products"); 
    
    // fastify.get() function to handle GET requests to the /products route
    fastify.get("/", async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process of getting a list of all products
        try {
            // constant to get the list of all products from the database using Prisma's findMany method
            const products = await fastify.prisma.product.findMany();

            // display a message in the terminal to indicate that the products were retrieved successfully and show the list of products
            console.log("Products retrieved successfully:", products);

            // return a 200 OK Request status response with a message and the list of retrieved products in the response body
            return reply.status(200).send({
                message: "Products retrieved successfully",
                products,
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
    console.log("Registering /products/my-products route for getting a list of the current user's products");

    // fastify.get() function to handle GET requests to the /products/my-products route, with a preHandler to require authentication
    fastify.get("/my-products", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process of getting a list of the current user's products
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

            // constant to get the list of the current user's products from the database using Prisma's findMany method
            const products = await fastify.prisma.product.findMany({
                where: { sellerId: request.user.userId },
            });

            // display a message in the terminal to indicate that the products were retrieved successfully and show the list of products
            console.log("Products retrieved successfully:", products);

            // return a 200 OK Request status response with a message and the list of retrieved products in the response body
            return reply.status(200).send({
                message: "Products retrieved successfully",
                products,
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

    // *********************************************************************************
    // route to edit a product
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering /products/:id route for updating a product");

    // fastify.put() function to handle PUT requests to the /products/:id route, with a preHandler to require authentication
    fastify.put("/:id", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product update process
        try {
            // constant to extract the id from the request parameters and the id, name, description, price, and stock from the request body
            const { id } = request.params as { id: string };
            const userId = request.user.userId;
            const { name, description, price, stock } = request.body as {
                name?: string;
                description?: string;
                price?: number;
                stock?: number;
            };

            // **** name, description, price, and stock variables may need data validation ****
            // only check the variables that were sent in the request body
            // create an if statement to check that:
            // name is a string if provided
            // description is a string if provided
            // price is a number if provided
            // stock is a number if provided
            // display a message in the terminal using console.log()
            // return a 400 HTTP status response if one or more variables are the wrong data type

            // constant to find a specific product by id
            const existingProduct = await fastify.prisma.product.findUnique({
                where: { id },
            });
            
            // if statement to check if the product exists
            if (!existingProduct) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Product not found.",
                });
            }

            // Verify that the logged in user owns the product
            if (existingProduct.sellerId !== userId) {
                return reply.status(403).send({
                    error: "ACCESS FORBIDDEN",
                    message: "You are not allowed to update this product."
                });
            }

            // constant to build the object to update the product, only including the fields that are defined in the request body
            const updateData: {
                name?: string;
                description?: string;
                price?: number;
                stock?: number;
            } = {};

            // if statements to check if each variable is defined before adding it to the updateData object
            if (name !== undefined) {
                updateData.name = name;
            }
            if (description !== undefined) {
                updateData.description = description;
            }
            if (price !== undefined) {
                updateData.price = price;
            }
            if (stock !== undefined) {
                updateData.stock = stock;
            }

            // constant to update the product in the database using Prisma's update method
            const product = await fastify.prisma.product.update({
                where: { id },
                data: updateData,
            });

            // display a message in the terminal to indicate that the product was updated successfully and show the updated product details
            console.log("Product updated successfully:", product);

            // return a 200 OK Request status response with a message and the updated product in the response body
            return reply.status(200).send({
                message: "Product updated successfully",
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

    // *********************************************************************************
    // route to delete a product
    // *********************************************************************************

    // display a message to show that the route has been registered
    console.log("Registering /products/:id route for deleting a product");

    // fastify.delete() function to handle DELETE requests to the /products/:id route, with a preHandler to require authentication
    fastify.delete("/:id", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product deletion process
        try {
            // constant to extract the id from the request parameters
            const { id} = request.params as { id: string};
            const userId = request.user.userId;

            // constant to finc the product by id
            const existingProduct = await  fastify.prisma.product.findUnique({
                where: { id },
            });

            // if statement to check if the product exists
            if (!existingProduct) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "product not found.",
                });
            }

            // Verify that the logged in user owns the product
            if (existingProduct.sellerId !== userId) {
                return reply.status(403).send({
                    error: "ACCESS FORBIDDEN",
                    message: "You are not allowed to delete this product."
                });
            }

            // delete the product from the database using Prisma's delete method
            await fastify.prisma.product.delete({
                where: { id },
            });

            // display a message in the terminal to indicate that the product was deleted successfully
            console.log("Product deleted successfully:", id);

            // return a 200 OK Request status response with a message indicating that the product was deleted successfully
            return reply.status(200).send({
                message: "Product deleted successfully",
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