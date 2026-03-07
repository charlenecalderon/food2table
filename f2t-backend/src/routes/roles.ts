import type { FastifyInstance } from "fastify";
import { Role } from "@prisma/client";
import console from "node:console";

type user = {
    userId: string;
};
type setRole={
    roles: string;
}
type updateRole={
    role: string[];
};
//const rolesAllowed = [Role.BUYER, Role.SELLER]as const;

export default async function registerRoles(fastify:FastifyInstance) {
//update user role
fastify.patch ("/users/:id/role", async (request, reply) => {
    try{
        const params = request.params as {id:string};
        const{id} = params;
       
        const updateRole = await fastify.prisma.user.update({
            where:{id},
            data:{
                roles: [Role.BUYER, Role.SELLER],

            },
            select: {
                id: true,
                email: true,
                roles:true, 
                updatedAt: true
            },
    });

        return reply.status(200).send({ //success
            message: "user is set to buyer and seller !", 
            user: updateRole,
        });
    }
        catch(error){
            console.error(error);
            return reply.status(500).send({ // server errorr
                error: "INTERNALL ERRRORR !!!",
            });
        }
    });

}