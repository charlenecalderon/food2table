import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const seller = await prisma.user.upsert({
    where: { email: "testfarmer@fresh2table.com" },
    update: {},
    create: {
      email: "testfarmer@fresh2table.com",
      passwordHash,
      profile: {
        create: {
          name: "Green Valley Farm",
          location: "Sacramento, CA",
          pickupInstructions: "Meet at the front gate. Bring your own bags!",
        },
      },
    },
  });

  console.log(`Seller created: ${seller.email} (id: ${seller.id})`);

  const productData = [
    {
      name: "Heirloom Tomatoes",
      description: "Vine-ripened heirloom tomatoes, mixed varieties. Sweet and juicy.",
      stock: 50,
      isAvailable: true,
    },
    {
      name: "Fresh Strawberries",
      description: "Hand-picked strawberries, no pesticides. Available by the pint.",
      stock: 30,
      isAvailable: true,
    },
    {
      name: "Organic Spinach",
      description: "Baby spinach leaves, washed and ready to eat. 1 lb bags.",
      stock: 20,
      isAvailable: true,
    },
    {
      name: "Zucchini",
      description: "Medium-sized green zucchini, great for grilling or baking.",
      stock: 40,
      isAvailable: true,
    },
    {
      name: "Sunflower Honey",
      description: "Raw unfiltered honey from our on-site beehives. 12 oz jar.",
      stock: 15,
      isAvailable: true,
    },
  ];

  const products = [];
  for (const data of productData) {
    const seedId = `seed-${data.name.toLowerCase().replace(/\s+/g, "-")}`;
    const product = await prisma.product.upsert({
      where: { id: seedId },
      update: {},
      create: {
        id: seedId,
        ...data,
        sellerId: seller.id,
      },
    });
    products.push(product);
    console.log(`Product created: ${product.name}`);
  }

  await prisma.listing.upsert({
    where: { id: "seed-veggie-bundle" },
    update: {},
    create: {
      id: "seed-veggie-bundle",
      title: "Weekly Veggie Bundle",
      description: "A curated mix of fresh vegetables from our farm. Great for families!",
      price: 18.99,
      quantity: [2, 1, 1],
      isAvailable: true,
      sellerId: seller.id,
      products: {
        create: [
          { productId: products[0].id },
          { productId: products[2].id },
          { productId: products[3].id },
        ],
      },
    },
  });

  console.log("Listing created: Weekly Veggie Bundle");
  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
