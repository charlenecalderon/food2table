// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Function to register order routes
export default async function orderRoutes(fastify: FastifyInstance) {
/*
    // display message to show that the order route has been loaded
    console.log("Order routes loaded");
    
    // *********************************************************************************
    // route to create an Order (manually create a cart)
    // *********************************************************************************

    // display a message to show that the POST /orders route has been registered
    console.log("Registering new /orders route for creating an order");

    // fastify.post() function to handle POST requests to the /orders route, with a preHandler to require authentication
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
            const order = await fastify.prisma.order.create({
                // data object to specify the data for the new product
                data: {
                    buyerId: userId,
                    status: "CART",
                },
            });

            // display a message in the terminal to indicate that the order was created successfully and show the order details
            console.log("Order created successfully:", order);

            // return a 201 Request Created status response with a message and the created order in the response body
            return reply.status(201).send({
                message: "Order (cart) created successfully",
                order,
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
    // route to get all orders for the current user
    // *********************************************************************************

    // display a message to show that the GET /orders route has been registered
    console.log("Registering /orders route for getting all orders for the current user");

    // fastify.get() function to handle any GET request to the /orders route, with a preHandler to require authentication
    fastify.get("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the logged in user's id
            const userId = request.user.userId; 

            // constant to find all logged in user's orders in the database using Prisma's findMany method
            // Also, include the order items related to each order using the include option
            const orders = await fastify.prisma.order.findMany({
                where: { buyerId: userId },
                include: { items: true, }
            });

            // display a message in the terminal to indicate that the orders were retrieved successfully and show all the order details
            console.log("Orders retrieved successfully:", orders);

            // return a 200 OK Request status response with a message and the retrieved order in the response body
            return reply.status(200).send({
                message: "Orders retrieved successfully",
                orders,
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
    // route to get the current user's active order (cart)
    // *********************************************************************************

    // display a message to show that the GET /orders/current route has been registered
    console.log("Registering /orders/current route for getting the current user's order (cart)");

    // fastify.get() function to handle any GET request to the /orders/current route, with a preHandler to require authentication
    fastify.get("/current", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the logged in user's id
            const userId = request.user.userId; 

            // constant to find the current user's order in the database using Prisma's findFirst method
            // Also, make sure that the order status is that of cart and include the order items related to that order using the include option
            const currentOrder = await fastify.prisma.order.findFirst({
                where: { buyerId: userId, status: "CART" },
                include: { items: { include: { product: true, } } },
            });

            // if statement to check if the current order exists
            if (!currentOrder) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "No active order (cart) found.",
                });
            }

            // display a message in the terminal to indicate that the current order was retrieved successfully and show all the order details
            console.log("Current order retrieved successfully:", currentOrder);

            // return a 200 OK Request status response with a message and the retrieved order in the response body
            return reply.status(200).send({
                message: "Current order retrieved successfully",
                currentOrder,
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
    // route to get a specific order by id for the current user
    // *********************************************************************************

    // display a message to show that the GET /orders/:id route has been registered
    console.log("Registering /orders/:id route for getting the current user's order by id");

    // fastify.get() function to handle any GET request to the /orders/:id route, with a preHandler to require authentication
    fastify.get("/:id", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the order id from the request params
            const { id } = request.params as { id: string };

            // get the logged in user's id
            const userId = request.user.userId; 

            // constant to find a specifc user's order in the database using Prisma's findFirst method
            // Also, make sure that the order status is that of cart and include the order items related to that order using the include option
            const order = await fastify.prisma.order.findFirst({
                where: { id, buyerId: userId },
                include: { items: { include: { product: true, } } },
            });

            // if statement to check if the current order exists
            if (!order) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Order not found.",
                });
            }

            // display a message in the terminal to indicate that the current order was retrieved successfully and show all the order details
            console.log("Order retrieved successfully:", order);

            // return a 200 OK Request status response with a message and the retrieved order in the response body
            return reply.status(200).send({
                message: "Order retrieved successfully",
                order,
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
    // route to update the order to PLACED status
    // *********************************************************************************

    // display a message to show that the PATCH /orders/:id/place route has been registered
    console.log("Registering /orders/:id/place route for placing an order");

    // fastify.patch() function to handle any PATCH request to the /orders/:id/place route, with a preHandler to require authentication
    fastify.patch("/:id/place", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the order id from the request params
            const { id } = request.params as { id: string };

            // get the logged in user's id
            const userId = request.user.userId;

            // constant to find the existing user's order in the database using Prisma's findUnique method
            // also include the order items and related products
            const  existingOrder = await fastify.prisma.order.findUnique({
                where: { id },
                include: { items: { include: { product: true, }, }, },
            });

            // if statement to check if the current order exists
            if (!existingOrder) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Order not found.",
                });
            }

            // if statement to verify that the current logged in user owns the order
            if (existingOrder.buyerId !== userId) {
                return reply.status(403).send({
                    error: "ACCESS FORBIDDEN",
                    message: "You do not have permission to access this order.",
                });
            }

            // if statement to verify that only CART or RESERVED orders can be placed
            if (existingOrder.status !== "CART" && existingOrder.status !== "RESERVED") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Only CART or RESERVED orders can be placed.",
                });
            }

            // if statement to verify that the order is not empty
            if (existingOrder.items.length === 0) {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "You cannot place an empty order.",
                });
            }

            // if statement to check CART and RESERVED statuses
            // if the order status is CART, then check stock and decrement stock for each product placed in the order
            // if the order status is RESERVED, then skip stock check and decrement since the stock has been decremented on the reserved route
            if (existingOrder.status === "CART") {
                // for loop to iterate through the order items in the current order
                // if statement to check if the quantity of ordered product is available in the stock
                for (const item of existingOrder.items) {
                    if (item.quantity > item.product.stock) {
                        return reply.status(400).send({
                            error: "BAD REQUEST",
                            message: `Not enough stock available for the product: ${item.product.name}.`,
                        });
                    }
                }

                // for loop to iterate through the order items in the current order
                // update the stock of each ordered product in the database by subtracting the ordered quantity from the current stock
                // utilize Prisma's update method and the decrement operator to update the stock of each product in the database
                for (const item of existingOrder.items) {
                    await fastify.prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { decrement: item.quantity, },
                        },
                    });
                }
            }

            // update the order status in the database using Prisma's update method
            const placedOrder = await fastify.prisma.order.update({
                where: { id },
                data: { 
                    status: "PLACED",
                },
                include: { items: { include: { product: true, }, }, },
            });

            // display a message in the terminal to indicate that the current order was placed successfully and show all the order details
            console.log("Order placed successfully:", placedOrder);

            // return a 200 OK Request status response with a message and the placed order in the response body
            return reply.status(200).send({
                message: "Order placed successfully",
                placedOrder,
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
    // route to update the order to COMPLETED status
    // *********************************************************************************

    // display a message to show that the PATCH /orders/:id/complete route has been registered
    console.log("Registering /orders/:id/complete route for completing an order");

    // fastify.patch() function to handle any PATCH request to the /orders/:id/complete route, with a preHandler to require authentication
    fastify.patch("/:id/complete", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the order id from the request params
            const { id } = request.params as { id: string };

            // get the logged in user's id
            const userId = request.user.userId;

            // constant to find the existing user's order in the database using Prisma's findUnique method
            const  existingOrder = await fastify.prisma.order.findUnique({
                where: { id },
            });

            // if statement to check if the current order exists
            if (!existingOrder) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Order not found.",
                });
            }

            // if statement to verify that the current logged in user owns the order
            if (existingOrder.buyerId !== userId) {
                return reply.status(403).send({
                    error: "ACCESS FORBIDDEN",
                    message: "You do not have permission to access this order.",
                });
            }

            // if statement to verify that only Placed orders can be completed
            if (existingOrder.status !== "PLACED") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Only PLACED orders can be completed.",
                });
            }

            // update the order status in the database using Prisma's update method
            const completedOrder = await fastify.prisma.order.update({
                where: { id },
                data: { 
                    status: "COMPLETED",
                },
                include: { items: { include: { product: true, }, }, },
            });

            // display a message in the terminal to indicate that the current order was completed successfully and show all the order details
            console.log("Order completed successfully:", completedOrder);

            // return a 200 OK Request status response with a message and the completed order in the response body
            return reply.status(200).send({
                message: "Order completed successfully",
                completedOrder,
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
    // route to reserve a CART order products (update the order to RESERVED status)
    // *********************************************************************************

    // display a message to show that the PATCH /orders/current/reserve route has been registered
    console.log("Registering /orders/current/reserve route for reserving an order");

    // fastify.patch() function to handle any PATCH request to the /orders/current/reserve route, with a preHandler to require authentication
    fastify.patch("/current/reserve", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the logged in user's id
            const userId = request.user.userId; 

            // constant to find the current user's order in the database using Prisma's findFirst method
            // Also, make sure that the order status is that of cart and include the order items related to that order using the include option
            const currentOrder = await fastify.prisma.order.findFirst({
                where: { buyerId: userId, status: "CART" },
                include: { items: { include: { product: true, } } },
            });

            // if statement to check if the current order exists
            if (!currentOrder) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "No active order (cart) found.",
                });
            }

            // if statement to verify that the cart is not empty
            if (currentOrder.items.length === 0) {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "You cannot reserve an empty cart.",
                });
            }

            // for loop to iterate through the order items in the current cart
            // if statement to check if the quantity of ordered product is available in the stock
            for (const item of currentOrder.items) {
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
            for (const item of currentOrder.items) {
                await fastify.prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity, },
                    },
                }); 
            }

            // update the order status in the database using Prisma's update method
            const reservedOrder = await fastify.prisma.order.update({
                where: { id: currentOrder.id },
                data: { 
                    status: "RESERVED",
                },
                include: { items: { include: { product: true, }, }, },
            });

            // display a message in the terminal to indicate that the current order was reserved successfully and show all the order details
            console.log("Order reserved successfully:", reservedOrder);

            // return a 200 OK Request status response with a message and the cancelled order in the response body
            return reply.status(200).send({
                message: "Order reserved successfully",
                reservedOrder,
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
    // route to update the order to CANCELLED status
    // *********************************************************************************

    // display a message to show that the PATCH /orders/:id/cancel route has been registered
    console.log("Registering /orders/:id/cancel route for cancelling an order");

    // fastify.patch() function to handle any PATCH request to the /orders/:id/cancel route, with a preHandler to require authentication
    fastify.patch("/:id/cancel", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the order id from the request params
            const { id } = request.params as { id: string };

            // get the logged in user's id
            const userId = request.user.userId;

            // constant to find the existing user's order in the database using Prisma's findUnique method
            // also include the order items and related products
            const  existingOrder = await fastify.prisma.order.findUnique({
                where: { id },
                include: { items: { include: { product: true, }, }, },
            });

            // if statement to check if the current order exists
            if (!existingOrder) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Order not found.",
                });
            }

            // if statement to verify that the current logged in user owns the order
            if (existingOrder.buyerId !== userId) {
                return reply.status(403).send({
                    error: "ACCESS FORBIDDEN",
                    message: "You do not have permission to access this order.",
                });
            }

            // if statement to verify that only Reserved and Placed orders can be cancelled
            if (existingOrder.status !== "RESERVED" && existingOrder.status !== "PLACED") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Only RESERVED and PLACED orders can be cancelled.",
                });
            }

            // for loop to iterate through the order items in the current order
            // update the stock of each product by the cancelled quantity by adding the cancelled quantity back to the current stock
            // utilize Prisma's update method and the increment operator to update the stock of each product in the database
            for (const item of existingOrder.items) {
                await fastify.prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity, },
                    },
                }); 
            }

            // update the order status in the database using Prisma's update method
            const cancelledOrder = await fastify.prisma.order.update({
                where: { id },
                data: { 
                    status: "CANCELLED",
                },
                include: { items: { include: { product: true, }, }, },
            });

            // display a message in the terminal to indicate that the current order was cancelled successfully and show all the order details
            console.log("Order cancelled successfully:", cancelledOrder);

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
    // route to delete an in progess order (cart)
    // *********************************************************************************

    // display a message to show that the DELETE /orders/:id route has been registered
    console.log("Registering /orders/:id route for deleting an order");

    // fastify.delete() function to handle any DELETE request to the /orders/:id route, with a preHandler to require authentication
    fastify.delete("/:id", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the order id from the request params
            const { id } = request.params as { id: string };

            // get the logged in user's id
            const userId = request.user.userId;

            // constant to find the existing user's order in the database using Prisma's findUnique method
            const  existingOrder = await fastify.prisma.order.findUnique({
                where: { id },
            });

            // if statement to check if the current order exists
            if (!existingOrder) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Order not found.",
                });
            }

            // if statement to verify that the current logged in user owns the order
            if (existingOrder.buyerId !== userId) {
                return reply.status(403).send({
                    error: "ACCESS FORBIDDEN",
                    message: "You do not have permission to access this order.",
                });
            }

            // if statement to verify the status of the order
            // only CART status orders can be deleted
            if (existingOrder.status !== "CART") {
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "Only CART orders can be deleted.",
                });
            }

            // delete the order in the database using Prisma's delete method
            await fastify.prisma.order.delete({
                where: { id },
            });

            // display a message in the terminal to indicate that the current order was deleted successfully
            console.log("Order deleted successfully:", id);

            // return a 200 OK Request status response with a message
            return reply.status(200).send({
                message: "Order deleted successfully",
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
    });*/
}