/*
  Warnings:

  - You are about to drop the column `description` on the `portfolio_works` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `portfolio_works` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "portfolio_works" DROP COLUMN "description",
DROP COLUMN "title";
