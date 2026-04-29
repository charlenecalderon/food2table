import buildServer from "../src/buildServer.js";

// create a function to send a request to update a user's password

async function testUpdateUserPasswordRoute() {
  const app = await buildServer();
  const userId = "cmmreo9o90000i0baeny29e7w"; // test user id from the database

  // call the functiont to update the user's password
    const response = await app.inject({
        method: "PATCH",
        url: `/users/${userId}/password`,
        payload: {
            password: "newpass369word",
        },
    });
    console.log("Status code:", response.statusCode);
    console.log("Response body:", response.body);

  await app.close();
}

testUpdateUserPasswordRoute();