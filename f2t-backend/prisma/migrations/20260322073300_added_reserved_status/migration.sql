-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'RESERVED';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isReserved" BOOLEAN NOT NULL DEFAULT false;
