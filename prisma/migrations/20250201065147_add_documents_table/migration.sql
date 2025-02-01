-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(3072) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);
