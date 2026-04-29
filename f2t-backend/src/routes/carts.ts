// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Function to register order routes
export default async function cartRoutes(fastify: FastifyInstance) {

    // display message to show that the cart route has been loaded
    console.log("Cart routes loaded");
    
    // *********************************************************************************
    // route to create a cart
    // *********************************************************************************

    // display a message to show that the POST /carts route has been registered
    console.log("Registering new /carts route for creating a cart");

    // fastify.post() function to handle POST requests to the /carts route, with a preHandler to require authentication
    fastify.post("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the logged in user's id
            const userId = request.user.userId;

            // constant to find an existing active order (cart) for the current user in the database using Prisma's findFirst method
            // also include the order items and related products
            const existingCart = await fastify.prisma.order.findFirst({
                where: { buyerId: userId, status: "CART", },
                include: { items: { include: { product: true, }, }, }, 
            });

            // if statement to check if the current user has an active order (cart)
            if (existingCart) {
                // display a message in the terminal to indicate that the user already has an active order (cart)
                console.log("User already has an active cart:", existingCart);

                // return a 200 OK Request status response with a message and the existing order (cart) in the response body
                return reply.status(200).send({
                    message: "Existing active cart retrieved successfully",
                    order: existingCart,
                });
            }

            // constant to create a new order in the database using Prisma's create method
            const cart = await fastify.prisma.order.create({
                // data object to specify the data for the new product
                data: {
                    buyerId: userId,
                    status: "CART",
                },
            });

            // display a message in the terminal to indicate that the order was created successfully and show the order details
            console.log("Order created successfully:", cart);

            // return a 201 Request Created status response with a message and the created order in the response body
            return reply.status(201).send({
                message: "Cart created successfully",
                cart,
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
    // route to reserve the products in the cart
    // *********************************************************************************

    // display a message to show that the PATCH /carts/reserve route has been registered
    console.log("Registering /carts/reserve route for reserving items in a cart");

    // fastify.patch() function to handle any PATCH request to the /carts/reserve route, with a preHandler to require authentication
    fastify.patch("/reserve", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the logged in user's id
            const userId = request.user.userId; 

            // constant to find the current user's cart in the database using Prisma's findFirst method
            // look for the CART status and include the order items related to the cart using the include option
            const currentCart = await fastify.prisma.order.findFirst({
                where: { buyerId: userId, status: "CART" },
                include: { items: { include: { product: true, } } },
            });

            // if statement to check if the current cart exists
            if (!currentCart) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "No active cart found.",
                });
            }

            // if statement to verify that the cart is not empty
            if (currentCart.items.length === 0) {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "You cannot reserve an empty cart.",
                });
            }

            // for loop to iterate through the items in the cart
            // if statement to check if the quantity of ordered products is available in the stock
            for (const item of currentCart.items) {
                if (item.quantity > item.product.stock) {
                    return reply.status(400).send({
                        error: "BAD REQUEST",
                        message: `Not enough stock available for the product: ${item.product.name}.`,
                    });
                }
            }

            // for loop to iterate through the order items in the current cart
            // update the stock of each ordered product in the database by subtracting the ordered quantity from the current stock
            // utilize Prisma's update method and the decrement operator to update the stock of each product in the database
            for (const item of currentCart.items) {
                await fastify.prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity, },
                    },
                }); 
            }

            // update the cart status to that of reserved in the database using Prisma's update method
            const reservedCart = await fastify.prisma.order.update({
                where: { id: currentCart.id },
                data: { 
                    status: "RESERVED",
                },
                include: { items: { include: { product: true, }, }, },
            });

            // display a message in the terminal to indicate that the current cart was reserved successfully and show all the cart details
            console.log("Cart reserved successfully:", reservedCart);

            // return a 200 OK Request status response with a message and the cancelled order in the response body
            return reply.status(200).send({
                message: "Cart reserved successfully",
                reservedCart,
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
    // route to cancel the reserved cart and return the stock back to the products
    // *********************************************************************************

    // display a message to show that the PATCH /carts/cancel route has been registered
    console.log("Registering /carts/cancel route for cancelling an order");

    // fastify.patch() function to handle any PATCH request to the /orders/:id/cancel route, with a preHandler to require authentication
    fastify.patch("/cancel", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            //
            // get the logged in user's id
            const userId = request.user.userId; 

            // constant to find the current user's cart in the database using Prisma's findFirst method
            // look for the RESERVED status and include the order items related to the cart using the include option
            const currentCart = await fastify.prisma.order.findFirst({
                where: { buyerId: userId, status: "RESERVED" },
                include: { items: { include: { product: true, } } },
            });

            // if statement to check if the current cart exists
            if (!currentCart) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "No active reserved cart found.",
                });
            }

            // if statement to verify that the cart is not empty
            if (currentCart.items.length === 0) {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "You cannot cancel an empty reservedcart.",
                });
            }

            // if statement to verify that only reserved carts can be cancelled
            if (currentCart.status !== "RESERVED") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Only RESERVED carts can be cancelled.",
                });
            }

            // for loop to iterate through the ordered items in the current cart
            // update the stock of each product by the cancelled quantity by adding the cancelled quantity back to the current stock
            // utilize Prisma's update method and the increment operator to update the stock of each product in the database
            for (const item of currentCart.items) {
                await fastify.prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity, },
                    },
                }); 
            }

            // update the cart status in the database using Prisma's update method
            const cancelledOrder = await fastify.prisma.order.update({
                where: { id: currentCart.id },
                data: { 
                    status: "CANCELLED",
                },
                include: { items: { include: { product: true, }, }, },
            });

            // display a message in the terminal to indicate that the current order was cancelled successfully and show all the order details
            console.log("Reserved cart cancelled successfully:", cancelledOrder);

            // return a 200 OK Request status response with a message and the cancelled order in the response body
            return reply.status(200).send({
                message: "Order cancelled successfully",
                cancelledOrder,
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
    // route to delete a cart
    // *********************************************************************************

    // display a message to show that the DELETE /carts/:id route has been registered
    console.log("Registering /carts/:id route for deleting a cart");

    // fastify.delete() function to handle any DELETE request to the /carts/:id route, with a preHandler to require authentication
    fastify.delete("/:id", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the cart (order) id from the request params
            const { id } = request.params as { id: string };

            // get the logged in user's id
            const userId = request.user.userId;

            // constant to find the existing user's cart in the database using Prisma's findUnique method
            const  existingCart = await fastify.prisma.order.findUnique({
                where: { id },
            });

            // if statement to check if the current cart exists
            if (!existingCart) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Order not found.",
                });
            }

            // if statement to verify that the current logged in user owns the cart
            if (existingCart.buyerId !== userId) {
                return reply.status(403).send({
                    error: "ACCESS FORBIDDEN",
                    message: "You do not have permission to access this order.",
                });
            }

            // if statement to verify the status of the cart
            // only CART status can be deleted
            if (existingCart.status !== "CART") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Only CART statuses can be deleted.",
                });
            }

            // delete the cart in the database using Prisma's delete method
            await fastify.prisma.order.delete({
                where: { id },
            });

            // display a message in the terminal to indicate that the current cart was deleted successfully
            console.log("Cart deleted successfully:", id);

            // return a 200 OK Request status response with a message
            return reply.status(200).send({
                message: "Cart deleted successfully",
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
    // route to get the current user's active cart
    // *********************************************************************************

    // display a message to show that the GET /carts/current route has been registered
    console.log("Registering /carts/current route for getting the current user's cart");

    // fastify.get() function to handle any GET request to the /carts/current route, with a preHandler to require authentication
    fastify.get("/current", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the logged in user's id
            const userId = request.user.userId; 

            // constant to find the current user's cart in the database using Prisma's findFirst method
            // look for the CART status and include the order items related to the cart using the include option
            const currentCart = await fastify.prisma.order.findFirst({
                where: { buyerId: userId, status: "CART" },
                include: { items: { include: { product: true, } } },
            });

            // if statement to check if the current cart exists
            if (!currentCart) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "No active cart found.",
                });
            }

            // display a message in the terminal to indicate that the current cart was retrieved successfully and show all the cart details
            console.log("Current order retrieved successfully:", currentCart);

            // return a 200 OK Request status response with a message and the retrieved order in the response body
            return reply.status(200).send({
                message: "Current cart retrieved successfully",
                currentCart,
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