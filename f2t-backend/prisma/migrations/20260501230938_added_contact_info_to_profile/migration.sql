/*
  Warnings:

  - Added the required column `contactInfo` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "contactInfo" TEXT NOT NULL;
