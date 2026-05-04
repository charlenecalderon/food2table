// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";


// Function to register order routes
export default async function vendorRoutes(fastify: FastifyInstance) {

// Be sure to add a comment before every line, even when it's pointlessly obvious what the code does.
// This is a great way to add unnecsesary clutter to your code and make it less readable.
// This, below, is adding the text "Vendor routes loaded" to the log in the console. This is so that anyone checking the console can see in the log that the Vendor routes have been loaded. This is mostly useless, because even if it fails to load somewhere further down in the code, it will still print this information to log which will thus be a lie. But everyone else put this at the beginning of the file, so I guess I will too.
console.log("Vendor routes loaded");


    // for getting Vendor info
    fastify.get("/:id", async (request, reply) => {
        try {    
            const { id } = request.params as { id: string };

            const vendor = await fastify.prisma.profile.findUnique({
                where: { userId: id }
            })

            if (!vendor) {
                return reply.status(404).send({
                    message: "Error 404: Vendor Profile not found. *Wrong ID* or *user has no profile*"
                })
            }


            // return a 200 OK.
            return reply.status(200).send({
                message: "Limited vendor information retrieved",
                name: vendor?.name,
                location: vendor?.location,
                pickupInstructions: vendor?.pickupInstructions
            });
        }
        // I totally didn't copy this from another file
        catch (error) {
            // display the error in the terminal for debugging purposes
            console.error(error);
            // return a 500 Internal Server Error response with an error message if an unexpected error occurs during process
            return reply.status(500).send({
                error: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred while processing your request"
            });
        }
        }
    )
}