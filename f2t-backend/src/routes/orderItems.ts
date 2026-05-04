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

            // make sure data is provided for both productId and quantity
            if (!productId||!quantity) {
                // display a message in the terminal to indicate missing authentication data
                console.log("Error: productId or quantity were not provided");

                // return a 400 bad request status response with an error message
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "productId or quantity were not provided.",
                });
            }

            // make sure productId is a string and quantity is a number
            if (typeof productId !== "string" || typeof quantity !== "number") {
                // display a message in the terminal to indicate faulty data
                console.log("Error: productId or quantity are wrong data type");

                // return a 400 bad request status response with an error message
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "productId or quantity are wrong data type.",
                });
            }

            //make sure quantity being added to cart is > 0
            if (quantity <= 0) {
                // display a message in the terminal to indicate faulty data
                console.log("Error: quantity must be > 0");

                // return a 400 bad request status response with an error message
                return reply.status(400).send({
                    error: "BAD REQUEST",
                    message: "quantity must be > 0.",
                });
            }

            // variable to check if the CART was created when placing the first order item
            let cartCreated = false;

            // constant to find the product based on the id in the database using Prisma's findUnique method
            const product = await fastify.prisma.product.findUnique({
                // data object to specify the data for the new product
                where: { id: productId },
            });

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
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            // get the logged in user's id
            const userId = request.user.userId;

            // constant to find the current user's active cart
            let currentCart = await fastify.prisma.order.findFirst({
                where: { buyerId: userId, status: "CART", },
                include: { items: { include: { product: true, }, }, }, 
            });

            // if statement to check if the current cart does not exist
            // if the cart does not exist, then return error
            if (!currentCart) {
                // display a message in the terminal to indicate missing authentication data
                console.log("fetch failure: could not find an existing cart");

                // return a 401 Unauthorized status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Could not find existing cart.",
                });
            };

            // return a 200 OK Request status response with a message and the orderItems
            return reply.status(200).send({
                message: "orderItems retrieved successfully",
                items: currentCart.items,
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
    // route to get a specific order item from the current user's cart
    // *********************************************************************************

    // display a message to show that the GET /orderItems/:productId route has been registered
    console.log("Registering /orderItems/:productId route for getting a specific order item from the current user's cart");

    // fastify.get() function to handle GET requests to the /orderItems/:productId route, with a preHandler to require authentication
    fastify.get("/:productId", { preHandler: fastify.requireAuth }, async (request, reply) => {
        // try-catch block to handle any errors that may occur during the product creation process
        try {
            const userId = request.user.userId;
            const { productId } = request.params as { productId: string };

            // Query the OrderItem directly, filtering by the parent Order's attributes
            const desiredOrderItem = await fastify.prisma.orderItem.findFirst({
                where: {
                    productId: productId, // Match the specific product
                    order: {
                        buyerId: userId,  // ONLY if the parent order belongs to this user
                        status: "CART"    // ONLY if the parent order is an active cart
                    }
                },
                include: { 
                    product: true, 
                },
            });

            // If the query returns null, the item isn't in the cart (or the cart doesn't exist)
            if (!desiredOrderItem) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Item not found in your active cart.",
                });
            }

            // Return a 200 OK status response with the requested item
            return reply.status(200).send({
                message: "Order item retrieved successfully",
                item: desiredOrderItem,
            });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred while processing your request.",
            });
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
            const userId = request.user.userId;
            const { productId } = request.params as { productId: string };

            // Query the OrderItem directly, filtering by the parent Order's attributes
            const desiredOrderItem = await fastify.prisma.orderItem.findFirst({
                where: {
                    productId: productId, // Match the specific product
                    order: {
                        buyerId: userId,  // ONLY if the parent order belongs to this user
                        status: "CART"    // ONLY if the parent order is an active cart
                    }
                },
                include: { 
                    product: true, 
                },
            });

            // If the query returns null, the item isn't in the cart (or the cart doesn't exist)
            if (!desiredOrderItem) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Item not found in your active cart.",
                });
            }

            //increment quantity of the desiredOrderItem
            desiredOrderItem.quantity++;

            //update the orderItems quantity
            await fastify.prisma.orderItem.update({
                    where: { id: desiredOrderItem.id },
                    data: { quantity: desiredOrderItem.quantity,},
                }); 

            // Return a 200 OK status response with the requested item
            return reply.status(200).send({
                message: "Order item incremented successfully",
                item: desiredOrderItem,
            });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred while processing your request.",
            });
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
            const userId = request.user.userId;
            const { productId } = request.params as { productId: string };

            // Query the OrderItem directly, filtering by the parent Order's attributes
            const desiredOrderItem = await fastify.prisma.orderItem.findFirst({
                where: {
                    productId: productId, // Match the specific product
                    order: {
                        buyerId: userId,  // ONLY if the parent order belongs to this user
                        status: "CART"    // ONLY if the parent order is an active cart
                    }
                },
                include: { 
                    product: true, 
                },
            });

            // If the query returns null, the item isn't in the cart (or the cart doesn't exist)
            if (!desiredOrderItem) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Item not found in your active cart.",
                });
            }

            //decrement quantity of the desiredOrderItem
            desiredOrderItem.quantity--;

            //update the orderItems quantity
            await fastify.prisma.orderItem.update({
                    where: { id: desiredOrderItem.id },
                    data: { quantity: desiredOrderItem.quantity,},
                }); 

            // Return a 200 OK status response with the requested item
            return reply.status(200).send({
                message: "Order item incremented successfully",
                item: desiredOrderItem,
            });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred while processing your request.",
            });
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
            const userId = request.user.userId;
            const { productId } = request.params as { productId: string };

            // Query the OrderItem directly, filtering by the parent Order's attributes
            const desiredOrderItem = await fastify.prisma.orderItem.findFirst({
                where: {
                    productId: productId, // Match the specific product
                    order: {
                        buyerId: userId,  // ONLY if the parent order belongs to this user
                        status: "CART"    // ONLY if the parent order is an active cart
                    }
                },
            });

            // If the query returns null, the item isn't in the cart (or the cart doesn't exist)
            if (!desiredOrderItem) {
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: "Item not found in your active cart.",
                });
            }

            //delete the orderItems from the cart
            await fastify.prisma.orderItem.delete({
                    where: {id: desiredOrderItem.id}
                }); 

            // Return a 200 OK status response with the requested item
            return reply.status(200).send({
                message: "Order item deleted successfully",
            });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred while processing your request.",
            });
        }
    });
}