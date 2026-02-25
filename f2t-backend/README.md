# F2T Backend — Sprint 1 Guide

This README explains how to use the backend structure for f2t.
    **NOTE:** Please have Node.js and Docker Desktop downloaded and installed.
    We are using TypeScript as the programming language. 

1. Start database
    Make sure that you are in the following folder in the VS Code Terminal:
    f2t-backend (use cd f2t-backend [Windows] or pwd f2t-backend [Mac])
    Once you have done that, run the following command to start the database:
    docker compose up -d

2. Install dependencies (only do it for the first time)
    Run the following command:
    npm install

3. Run database updates
    Run the following command: 
    npm run prisma:migrate -- --name init

4. Start the server
    Run the following command: 
    npm run dev

5. These files might need to be imported to authenticate information:
    /plugins/authentication.ts
    /routes/authentication.ts

6. Code to call the cookie and JWT variables from .env using /plugins/authentication.ts:
    process.env.JWT_SECRET_KEY
    process.env.COOKIE_SECRET_KEY

7. Fastify commands should be global
    Use the following format: 
    fastify.commandName

# Sprint 1 Assignements

Instructions for each backend-developer
    **NOTE:** The prisma/schema.prisma file has information that we want to create/set/update
    for our users. Let me know on Discord if there is any other information we should consider. 

1. Thomas - Authentication Routes 
    Set a way to register/create a new user
    Set the ability to log in and logout 
    Get information about the user (Can be used to see profiles) 
        **NOTE:** Use bcrypt for passwords
        Use fastify.jwt.sign({ userId, roles }) to create a secure login token
        The JWT (JSON Web Token) is stored in the cookie named session
        Protect the routes with preHandler: fastify.requireAuth
        Get access to the user ID with request.user.userId 



2. Anastasia - Profile Routes
    Get the profile for another user
    Get your own profile
    Set a way to update your own profile
        **NOTE:** Protect the routes with preHandler: fastify.requireAuth
        Get access to the user ID with request.user.userId 
        Get access to the user and profile tables from the database by using:
            fastify.prisma.profile
            fastify.prisma.user

3. Charlene - Roles Routes
    Set the ability to change roles (BUYER/SELLER) 
        **NOTE:** The default role is already set to BUYER
        Protect the routes with preHandler: fastify.requireAuth
        Get access to the user ID with request.user.userId 
        Get access to the user table from the database by using:
            fastify.prisma.user