/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `DailySchedule` will be added. If there are existing duplicate values, this will fail.
  - Made the column `day` on table `DailySchedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DailySchedule" ALTER COLUMN "day" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailySchedule_profileId_key" ON "DailySchedule"("profileId");
