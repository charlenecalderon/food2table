import buildServer from "../src/buildServer.js";

async function testCreateProductRoute() {
  console.log("1. Test file started"); //display message
  const fastifyApp = await buildServer();
  console.log("2. Server built"); // display message

  try {
    // create a test user first
    console.log("3. About to send request"); // display message

    // create a unique email string to avoid conflicts with existing users in the database every time the test is run
    const randomNumber = Math.floor(Math.random() * 1000000);
    const testEmail = `producttest-${randomNumber}@example.com`;
    console.log("Test email:", testEmail);

    const user = await fastifyApp.prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: "testpassword"
      }
    });

    // create a valid jwt token
    const token = fastifyApp.jwt.sign({
      userId: user.id
    });

    const response = await fastifyApp.inject({
      method: "POST",
      url: "/products",
      payload: {
        name: "Apple",
        description: "Fresh apples",
        price: 3.99
      },
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    const products = await fastifyApp.prisma.product.findMany();
    console.log("Products in database:", products);
  } catch (error) {
    console.error(error);
  } finally {
    await fastifyApp.close();
  }
}

await testCreateProductRoute();