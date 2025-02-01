/*
  Warnings:

  - You are about to drop the column `line` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "line",
DROP COLUMN "title";
