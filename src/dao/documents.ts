import { createId } from "@paralleldrive/cuid2";
import { embedText } from "../lib/ai";
import prisma from "./prisma";

export async function embedDocument(text: string): Promise<void> {
  const embedding = await embedText(text);
  const id = createId();

  const insertQuery = `
      INSERT INTO documents (id, content, embedding)
      VALUES ($1, $2, $3)
    `;

  await prisma.$queryRawUnsafe(insertQuery, id, text, embedding);
}

export async function searchDocuments(query: string): Promise<string[]> {
  const embedding = await embedText(query);

  const searchQuery = `
      SELECT content
      FROM documents
      ORDER BY embedding <#> $1::vector
      LIMIT 5
    `;

  const results = await prisma.$queryRawUnsafe<{ content: string }[]>(
    searchQuery,
    embedding
  );

  return results.map((result) => result.content);
}
