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
}