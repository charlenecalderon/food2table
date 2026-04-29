/*
  Warnings:

  - The primary key for the `DailySchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DailySchedule` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "DailySchedule_profileId_day_key";

-- DropIndex
DROP INDEX "DailySchedule_profileId_key";

-- AlterTable
ALTER TABLE "DailySchedule" DROP CONSTRAINT "DailySchedule_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "DailySchedule_pkey" PRIMARY KEY ("profileId", "day");

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "createdAt",
DROP COLUMN "price",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER[],
    "price" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "sellerId" TEXT NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductsToListings" (
    "productId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "ProductsToListings_pkey" PRIMARY KEY ("listingId","productId")
);

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsToListings" ADD CONSTRAINT "ProductsToListings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsToListings" ADD CONSTRAINT "ProductsToListings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
