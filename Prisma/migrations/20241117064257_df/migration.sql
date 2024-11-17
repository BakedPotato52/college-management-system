/*
  Warnings:

  - Made the column `bloodType` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bloodType` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "bloodType" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "bloodType" SET NOT NULL;
