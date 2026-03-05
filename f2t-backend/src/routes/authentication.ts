import Fastify from 'fastify'
const fp = Fastify()

// quick test
export default async function maketestaccount() {
    console.log("!!Just to be clear: We did make it to this function!!");
    const user = await fp.prisma.user.create({
        data: {
            email: "VERYRAPIDLYgoinginsane@FML.UGH",
            passwordHash: "123456",
        }
    });
}
