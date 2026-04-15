import buildServer from "../src/buildServer.js";

async function testLoginUserRoute() {
  const app = await buildServer();

  const randomNumber = Math.floor(Math.random() * 1000000);
  const email = `usertest-${randomNumber}@example.com`;
  const password = "testpassword";

  // create user
  const user = await app.prisma.user.create({
    data: {
      email: email,
      passwordHash: "testpassword"
    }
  });

  console.log("User created:", user);

  // login user
  const response = await app.inject({
    method: "POST",
    url: "/users/login", // make sure this matches your route prefix
    payload: {
      email: email,
      password: password
    }
  });

  // Print the status code returned by the server
  console.log("Status code:", response.statusCode);

  // Print the response body from the server
  // This is usually a JSON string (e.g., { message: "Login successful" })
  console.log("Response body:", response.body);

  // Print cookies returned by the server
  // Should include the "session" cookie containing your JWT token
  console.log("Cookies:", response.cookies);

  await app.close();
}

testLoginUserRoute();

// async function testUserRoutes() {
//   const app = await buildServer();

//   await app.ready();

//   // Show all registered routes
//   console.log(app.printRoutes());

//   const randomNumber = Math.floor(Math.random() * 1000000);
//   const email = `usertest-${randomNumber}@example.com`;
//   const password = "testpassword";

//   // Test the create-user route through Fastify itself
//   const createResponse = await app.inject({
//     method: "POST",
//     path: "/users",
//     headers: {
//       "content-type": "application/json"
//     },
//     payload: {
//       email,
//       password
//     }
//   });

//   console.log("Create status code:", createResponse.statusCode);
//   console.log("Create response body:", createResponse.body);
//   console.log("Create cookies:", createResponse.cookies);

//   // Test the login route through Fastify itself
//   const loginResponse = await app.inject({
//     method: "POST",
//     path: "/users/login",
//     headers: {
//       "content-type": "application/json"
//     },
//     payload: {
//       email,
//       password
//     }
//   });

//   console.log("Login status code:", loginResponse.statusCode);
//   console.log("Login response body:", loginResponse.body);
//   console.log("Login cookies:", loginResponse.cookies);

//   await app.close();
// }

// testUserRoutes();