-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "filename" TEXT,
ADD COLUMN     "line" INTEGER,
ADD COLUMN     "page" INTEGER,
ADD COLUMN     "title" TEXT;
