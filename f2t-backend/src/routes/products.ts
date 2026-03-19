// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// Function to register product routes
export default async function productRoutes(fastify: FastifyInstance) {
    
    // display message to show that the route has been loaded
    console.log("Product routes loaded");
    
    // route to create a product
    fastify.post("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        try {
            const { name, description, price } = request.body as {
                name: string;
                description: string;
                price: number;
            
            };  

            // create a new product in the database
            const product = await fastify.prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    sellerId: request.user.userId, // get the id of the currently authenticated user from the request object
                    //sellerId: "cmmreo9o90000i0baeny29e7w", // get the id of the currently authenticated user from the request object
                },
            });

            // return a success response with the created product
            return reply.status(201).send({
                message: "Product created successfully",
                product,
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
            });
        }
    });

    // route to edit a product
    fastify.put("/:id", { preHandler: fastify.requireAuth }, async (request, reply) => {
        try {
            const params = request.params as { id: string };
            const { id } = params;
            const { name, description, price } = request.body as {
                name?: string;
                description?: string;
                price?: number;
            };

            // build the object to update the product with only the fields that are provided in the request body
            const updateData: {
                name?: string;
                description?: string;
                price?: number;
            } = {};

            // assign the values to the updateData object only if they are defined in the request body
            if (name !== undefined) {
                updateData.name = name;
            }
            if (description !== undefined) {
                updateData.description = description;
            }
            if (price !== undefined) {
                updateData.price = price;
            }

            // update the product in the database
            const product = await fastify.prisma.product.update({
                where: { id },
                data: updateData,
            });

            // return a success response with the updated product
            return reply.status(200).send({
                message: "Product updated successfully",
                product,
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
            });
        }
    });

    // route to delete a product
    fastify.delete("/:id", { preHandler: fastify.requireAuth }, async (request, reply) => {
        try {
            const params = request.params as { id: string };
            const { id } = params;

            // delete the product from the database
            await fastify.prisma.product.delete({
                where: { id },
            });

            // return a success response indicating that the product was deleted
            return reply.status(200).send({
                message: "Product deleted successfully",
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
            });
        }
    });
}