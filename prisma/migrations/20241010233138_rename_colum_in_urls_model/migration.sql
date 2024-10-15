/*
  Warnings:

  - You are about to drop the column `deleted` on the `urls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "urls" DROP COLUMN "deleted",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
