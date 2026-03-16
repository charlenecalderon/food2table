import buildServer from "../src/buildServer.js";

async function testCreateuserRoute() {
  const app = await buildServer();

const randomNumber = Math.floor(Math.random() * 1000000);
  const email = `usertest-${randomNumber}@example.com`;

  const user = await app.prisma.user.create({
    data: {
      email: email,
      passwordHash: "testpassword"
    }
  });

  console.log("User created:", user);

  await app.close();
}

testCreateuserRoute();