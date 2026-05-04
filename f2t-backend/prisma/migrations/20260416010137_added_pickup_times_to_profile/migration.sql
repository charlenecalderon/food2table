-- CreateEnum
CREATE TYPE "Day" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'NONE');

-- CreateTable
CREATE TABLE "DailySchedule" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "days" "Day"[] DEFAULT ARRAY['NONE']::"Day"[],
    "times" BOOLEAN[] DEFAULT ARRAY[false]::BOOLEAN[],
    "isOpen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DailySchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailySchedule" ADD CONSTRAINT "DailySchedule_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
