/*
  Warnings:

  - You are about to drop the column `days` on the `DailySchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailySchedule" DROP COLUMN "days",
ADD COLUMN     "day" TEXT;
