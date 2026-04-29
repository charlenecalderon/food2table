// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Function to register order Item routes
export default async function orderItemRoutes(fastify: FastifyInstance) {
    // display message to show that the order route has been loaded
    console.log("Order Items routes loaded");
    
    // *********************************************************************************
    // route to add a product to a cart (create an order item)
    // *********************************************************************************

    // display a message to show that the POST /orderItems route has been registered
    console.log("Registering new /orderItems route for creating an order item");

    // fastify.post() function to handle POST requests to the /orders route, with a preHandler to require authentication
    fastify.post("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the logged in user's id
            const userId = request.user.userId;

            // constant to get the product id and product quantity from the request body
            const { productId, quantity } = request.body as {
                productId: string;
                quantity: number;
            }

            // **** productId variable needs input validation ****
            // create an if statement to check that productId is not empty
            // profiles.ts have an example on the create route with the name variable validation
            // display a message in the terminal using console.log()
            // return a 400 HTTP status response if the productId input is missing

            // **** quantity variable needs input validation ****
            // create an if statement to check that quantity was sent
            // follow similar if statements as the required variable validation
            // display a message in the terminal using console.log()
            // return a 400 HTTP status response if the quantity input is missing

            // **** productId and quantity variables need data type validation ****
            // create an if statement to check that:
            // productId is a string
            // quantity is a number
            // display a message in the terminal using console.log()
            // return a 400 HTTP status response if one or more variables are the wrong data type

            // **** quantity variable needs input value validation. We cannot have a quantity of 0 or less ****
            // create an if statement to check that quantity is greater than 0
            // display a message in the terminal using console.log()
            // return a 400 HTTP status response if quantity is 0 or less

            // variable to check if the CART was created when placing the first order item
            let cartCreated = false;

            // constant to find the product based on the id in the database using Prisma's findUnique method
            const product = await fastify.prisma.product.findUnique({
                // data object to specify the data for the new product
                where: { id: productId },
            });

            // **** productId variable needs existence/database validation ****
            // create an if statement to check if the product exists in the database
            // orders.ts have an example on the create order route with the existingCart variable validation
            // utilize a constant to find the peoduct in the database using Prisma's findUnique method and the productId from the request body
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the product does not exist

            // if statment to check if the product exists
            if (!product) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Product not found",
                });
            }

            // constant to find the current user's active cart
            let currentCart = await fastify.prisma.order.findFirst({
                where: { buyerId: userId, status: "CART", },
            });

            // if statement to check if the current cart does not exist
            // if the cart does not exist, then we create a new cart
            if (!currentCart) {
                currentCart = await fastify.prisma.order.create({
                    data: {
                        buyerId: userId,
                        status: "CART",
                    },
                });

                // update the cartCreated variable to true
                cartCreated = true;

                // display a message in the terminal to indicate that the cart was created successfully and show the cart details
                console.log("Cart created successfully:", currentCart);
            }

            // constant to check if the product is already in the cart
            const existingOrderItem = await fastify.prisma.orderItem.findFirst({
                where: { orderId: currentCart.id, productId, },
            });

            // set a variable to hold the order item that will be created or updated
            let orderItem;

            // if stament to check if the product is already in the cart
            // if the product is already in the cart, then we update the quantity of the existing order item
            if (existingOrderItem) {
                orderItem = await fastify.prisma.orderItem.update({
                    // orderId_productId is a composite unique key (orderId + productId) defined in the schema.prisma file
                    // It helps us to find the existing order item for the current cart and product
                    // It also ensures that there can only be one order item for a specific product, so the will be no duplicate order items
                    where: { orderId_productId: { orderId: currentCart.id, productId, }, },
                    data: {
                        quantity: existingOrderItem.quantity + quantity,
                    },
                    include: { product: true, },
                });
            }
            // else statement to create a new order item if the product is not already in the cart
            else {
                orderItem = await fastify.prisma.orderItem.create({
                    data: {
                        orderId: currentCart.id,
                        productId,
                        quantity,
                    },
                    include: { product: true, },
                });
            }

            // display a message in the terminal to indicate that the order item was created successfully and show the order item details
            // a product was added successfully to the cart
            console.log("Product added to cart successfully:", orderItem);

            // if statement to check the value for the cartCreated variable
            // if set to true, then display a message in the terminal to indicate that the cart was created while placing the first order item
            if (cartCreated) {
                console.log("Cart was created while placing the first order item");
            }

            // return a 201 Request Created status response with a message and the created order item in the response body
            // there is a created cart message and a updated cart message depeinding on the cartCreated variable
            return reply.status(201).send({
                message: cartCreated
                ? "Cart and Order Item created successfully"
                : "Cart updated succesffuly with new order item",
                cartCreated,
                orderItem,
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
    // route to get all order items form the current user's cart
    // *********************************************************************************

    // display a message to show that the GET /orderItems route has been registered
    console.log("Registering /orderItems route for getting all order items from the current user's cart");

    // fastify.get() function to handle GET requests to the /orderItems route, with a preHandler to require authentication
    fastify.get("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process
        try {
            // get the logged in user's id

            // constant to find the current user's active cart in the database
            // make sure the order status is CART
            // also include the order items and related product information

            // **** current cart needs existence/database validation ****
            // create an if statement to check if the current user's CART exists in the database
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the current cart does not exist

            // display a message in the terminal to indicate that the cart items were retrieved successfully

            // return a 200 OK response with a message and the cart/order items in the response body
        }

        // catch block to handle any errors that may occur
        catch (error) {
            // display the error in the terminal for debugging purposes

            // return a 500 Internal Server Error response
        }
    });

    // *********************************************************************************
    // route to get a specific order item from the current user's cart
    // *********************************************************************************

    // display a message to show that the GET /orderItems/:productId route has been registered
    console.log("Registering /orderItems/:productId route for getting a specific order item from the current user's cart");

    // fastify.get() function to handle GET requests to the /orderItems/:productId route, with a preHandler to require authentication
    fastify.get("/:productId", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process
        try {
            // get the logged in user's id

            // get the product id from the request params

            // constant to find the current user's active cart in the database

            // **** current cart needs existence/database validation ****
            // create an if statement to check if the current user's CART exists in the database
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the current cart does not exist

            // constant to find the specific order item in the current cart using the product id

            // **** order item needs existence/database validation ****
            // create an if statement to check if the order item exists in the current cart
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the order item does not exist

            // display a message in the terminal to indicate that the order item was retrieved successfully

            // return a 200 OK response with a message and the retrieved order item
        }

        // catch block to handle any errors that may occur
        catch (error) {
            // display the error in the terminal for debugging purposes

            // return a 500 Internal Server Error response
        }
    });

    // *********************************************************************************
    // route to increase the quantity of an order item in the current user's cart
    // *********************************************************************************

    // display a message to show that the PATCH /orderItems/:productId/increase route has been registered
    console.log("Registering /orderItems/:productId/increase route for increasing the quantity of an order item");

    // fastify.patch() function to handle PATCH requests to the /orderItems/:productId/increase route, with a preHandler to require authentication
    fastify.patch("/:productId/increase", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process
        try {
            // get the logged in user's id

            // get the product id from the request params

            // constant to find the current user's active cart in the database

            // **** current cart needs existence/database validation ****
            // create an if statement to check if the current user's CART exists in the database
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the current cart does not exist

            // constant to find the existing order item in the current cart

            // **** order item needs existence/database validation ****
            // create an if statement to check if the order item exists in the current cart
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the order item does not exist

            // update the order item quantity in the database by incrementing it by 1
            // include the related product information

            // display a message in the terminal to indicate that the quantity was increased successfully

            // return a 200 OK response with a message and the updated order item
        }

        // catch block to handle any errors that may occur
        catch (error) {
            // display the error in the terminal for debugging purposes

            // return a 500 Internal Server Error response
        }
    });

    // *********************************************************************************
    // route to decrease the quantity of an order item in the current user's cart
    // *********************************************************************************

    // display a message to show that the PATCH /orderItems/:productId/decrease route has been registered
    console.log("Registering /orderItems/:productId/decrease route for decreasing the quantity of an order item");

    // fastify.patch() function to handle PATCH requests to the /orderItems/:productId/decrease route, with a preHandler to require authentication
    fastify.patch("/:productId/decrease", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process
        try {
            // get the logged in user's id

            // get the product id from the request params

            // constant to find the current user's active cart in the database

            // **** current cart needs existence/database validation ****
            // create an if statement to check if the current user's CART exists in the database
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the current cart does not exist

            // constant to find the existing order item in the current cart

            // **** order item needs existence/database validation ****
            // create an if statement to check if the order item exists in the current cart
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the order item does not exist

            // if statement to check the current quantity of the order item
            // if the quantity is greater than 1, then decrement the quantity by 1
            // else if the quantity is 1, then optionally delete the order item from the cart

            // display a message in the terminal to indicate that the quantity was decreased successfully
            // or that the order item was removed from the cart if quantity reached 0

            // return a 200 OK response with a message and the updated order item
            // or return a message indicating that the item was removed from the cart
        }

        // catch block to handle any errors that may occur
        catch (error) {
            // display the error in the terminal for debugging purposes

            // return a 500 Internal Server Error response
        }
    });

    // *********************************************************************************
    // route to remove a specific order item from the current user's cart
    // *********************************************************************************

    // display a message to show that the DELETE /orderItems/:productId route has been registered
    console.log("Registering /orderItems/:productId route for deleting a specific order item from the current user's cart");

    // fastify.delete() function to handle DELETE requests to the /orderItems/:productId route, with a preHandler to require authentication
    fastify.delete("/:productId", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the process
        try {
            // get the logged in user's id

            // get the product id from the request params

            // constant to find the current user's active cart in the database

            // **** current cart needs existence/database validation ****
            // create an if statement to check if the current user's CART exists in the database
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the current cart does not exist

            // constant to find the existing order item in the current cart

            // **** order item needs existence/database validation ****
            // create an if statement to check if the order item exists in the current cart
            // display a message in the terminal using console.log()
            // return a 404 HTTP status response if the order item does not exist

            // delete the order item from the database

            // display a message in the terminal to indicate that the order item was deleted successfully

            // return a 200 OK response with a message
        }

        // catch block to handle any errors that may occur
        catch (error) {
            // display the error in the terminal for debugging purposes

            // return a 500 Internal Server Error response
        }
    });
}