import type { FastifyInstance } from "fastify";
import { Role } from "@prisma/client";

export default async function registerRoles(fastify: FastifyInstance) {
    console.log("Roles routes loaded");

    fastify.patch("/users/:id/role", async (request, reply) => {
        try {
            const params = request.params as { id: string };
            const { id } = params;

            const updateRole = await fastify.prisma.user.update({
                where: { id },
                data: {
                    roles: [Role.BUYER, Role.SELLER],
                },
                select: {
                    id: true,
                    email: true,
                    roles: true,
                    updatedAt: true,
                },
            });

            return reply.status(200).send({
                message: "User role was updated successfully.",
                user: updateRole,
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: "Internal server error.",
            });
        }
    });
}