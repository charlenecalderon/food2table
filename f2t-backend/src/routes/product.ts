// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// quick test
export default async function profileRoutes(fastify: FastifyInstance) {
    
    // display message to show that the route has been loaded
    console.log("Product routes loaded");
    

}