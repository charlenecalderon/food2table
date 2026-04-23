// new function sample: fastify.wahatever ("/profiles/funtionName
// Import the Fastify type so TypeScript understands the fastify object
import type { FastifyInstance } from "fastify";

// quick test
export default async function dailyScheduleRoutes(fastify: FastifyInstance) {
    
    // display message to show that the route has been loaded
    console.log("dailySchedule routes loaded");
    
    // ***********************************************************************
    // route to create dailySchedule 
    // ***********************************************************************

    fastify.post("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        try {
            //get currently logged in user's userId
            const userId = request.user.userId;

            //read in input
            const { day } = request.body as {
                day: string;
            };

            //NEED INPUT VALIDATION. VALIDATE DATA TYPES AND THAT VARIABLES ARE NOT EMPTY. 
            //ALSO MAKE SURE THAT NO PREVIOUS SCHEDULE FOR THE DAY EXISTS

            //Search for profile connected to this userId so we can get profileId
            const Profile = await fastify.prisma.profile.findUnique({
                where: {userId: userId}
            });
            
            //if statement to check if the profile exists
            if (!Profile) {

                // display a message in the terminal to indicate that the profile was not found
                console.log(`Schedule creation update failed: profile ID could not be found`);

                // return a 404 Not Found status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: `No profile associated with current user could be found.`,
                });
            }

            //create the array times[] to put in this dailySchedule
            const times: boolean[] = [];

            //fill array with 24 elements; one for each hour in the day.
            for (let i = 0; i < 24; i++)
            {
                times.push(false);
            }

            // create the daily schedule for the specified day
            const dailySchedule = await fastify.prisma.dailySchedule.create({
                data: {
                    day,
                    isOpen: false,
                    times,
                    profileId: Profile.id,
                },
            });

            // display a message in the terminal to indicate that the schedule was created successfully
            console.log(`Schedule created successfully`);

            // return a 200 OK response with a success message and the updated schedule
            return reply.status(200).send({
                message: "Schedule created successfully",
                dailySchedule
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
    // route to edit dailySchedule
    // *********************************************************************************

    fastify.patch("/", { preHandler: fastify.requireAuth }, async (request, reply) => {
        try {
            //object to read in input. editDay must contain id of the dailySchedule being edited 
            const { editDay, editTimes, isAvailable } = request.body as {
                editDay: string;
                editTimes: number[];
                isAvailable: boolean[];
            };

            //NEED INPUT VALIDATION. VALIDATE DATA TYPES AND THAT VARIABLES ARE NOT EMPTY
            //Input validation to make sure name, description, price and stock are not blank
            if(!editDay||!editTimes||!isAvailable)
            {
                console.log("ERROR: Missing arguments. Day, times, and availability are required.")
                return reply.status(400).send({
                    error:"MISSING INPUT",
                    message:"Day, times, and availability are required."
                });
            }

            //Input validation to make sure name and description are strings, and price and stock are numbers
            if(typeof editDay!=="string"||typeof editTimes[0]!=="number"||typeof isAvailable[0]!=="boolean")
            {
                console.log("ERROR: INVALID DATATYPE");
                return reply.status(400).send({
                    error: "INVALID INPUT",
                    message: "Day must be a string, time must be a number, and availability must be a bool."
                });
            }

            //get currently logged in user's userId
            const userId = request.user.userId;

            //Search for profile connected to this userId so we can get profileId
            const Profile = await fastify.prisma.profile.findUnique({
                where: {userId: userId}
            });
            
            //if statement to check if the profile exists
            if (!Profile) {

                // display a message in the terminal to indicate that the profile was not found
                console.log(`Schedule creation update failed: profile ID could not be found`);

                // return a 404 Not Found status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: `No profile associated with current user could be found.`,
                });
            }

            //Copy specified dailySchedule from database and store it in updateDay
            const updateDay = await fastify.prisma.dailySchedule.findUnique({
                where: { profileDay: { profileId: Profile.id, day: editDay, }, },
            });
            
            //if statement to check if the dailySchedule exists
            if (!updateDay) {
                // display a message in the terminal to indicate that the profile was not found
                console.log(`Schedule update failed: no ${editDay} schedule found under profile ID ${Profile.id}.`);

                // return a 404 Not Found status response with an error message
                return reply.status(404).send({
                    error: "NOT FOUND",
                    message: `Schedule update failed: no ${editDay} schedule found under profile ID ${Profile.id}.`,
                });
            }

            //loop through times array and set desired availability to each time slot
            for (let i = 0; i < editTimes.length; i++)
            {
                if(editTimes[i] !== undefined)
                {
                    updateDay.times[editTimes[i]] = isAvailable[i];
                }

            }

            //loop through times array again. If every time availability is false, set isOpen to false, otherwise set
            //isOpen to true.
            updateDay.isOpen = false;
            for (let i = 0; i < 24; i++)
            {
                if (updateDay.times[i] == true) { updateDay.isOpen = true; break;}
            }

            // update the profile name in the database
            const dailySchedule = await fastify.prisma.dailySchedule.update({
                where: { profileDay: { profileId: Profile.id, day: editDay, }, },
                data: updateDay,
            });

            // display a message in the terminal to indicate that the schedule name was updated successfully
            console.log(`Schedule updated successfully`);

            // return a 200 OK response with a success message and the updated schedule
            return reply.status(200).send({
                message: "Schedule updated successfully",
                dailySchedule
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