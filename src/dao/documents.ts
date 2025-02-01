import { createId } from "@paralleldrive/cuid2";
import { embedText, extractMetadata } from "../lib/ai";
import prisma from "./prisma";

export async function embedDocument(text: string, filename: string): Promise<void> {
  const embedding = await embedText(text);
  const id = createId();

  const insertQuery = `
      INSERT INTO documents (id, filename, content, embedding)
      VALUES ($1, $2, $3, $4)
    `;

  await prisma.$queryRawUnsafe(insertQuery, id, filename, text, embedding);
}

export async function searchDocuments(query: string): Promise<string[]> {
  const embedding = await embedText(query);
  const { title, filename, page, line } = await extractMetadata(query);

  const whereClauses = [];

  title && whereClauses.push(`title = '${title}'`);
  filename && whereClauses.push(`filename = '${filename}'`);
  page && whereClauses.push(`page = ${page}`);
  line && whereClauses.push(`line = ${line}`);

  const whereClause = whereClauses.join(" AND ");

  const searchQuery = `
    SELECT content
    FROM documents
    ${whereClause ? `WHERE ${whereClause}` : ""}
    ORDER BY embedding <#> $1::vector
    LIMIT 5
  `;

  const results = await prisma.$queryRawUnsafe<{ content: string }[]>(
    searchQuery,
    embedding
  );

  return results.map((result) => result.content);
}
