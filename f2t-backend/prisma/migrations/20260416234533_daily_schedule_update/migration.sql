/*
  Warnings:

  - A unique constraint covering the columns `[profileId,day]` on the table `DailySchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailySchedule_profileId_day_key" ON "DailySchedule"("profileId", "day");
