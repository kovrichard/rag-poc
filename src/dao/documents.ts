import { createId } from "@paralleldrive/cuid2";
import { embedText, extractMetadata } from "../lib/ai";
import type { TemporaryDocument } from "../lib/types";
import prisma from "./prisma";

export async function embedDocument(
  doc: TemporaryDocument,
  filename: string
): Promise<void> {
  const embedding = await embedText(doc.content);
  const id = createId();

  const insertQuery = `
    INSERT INTO documents (id, filename, page, content, embedding)
    VALUES ($1, $2, $3, $4, $5)
  `;

  await prisma.$queryRawUnsafe(
    insertQuery,
    id,
    filename,
    doc.page,
    doc.content,
    embedding
  );
}

export async function searchDocuments(
  query: string
): Promise<(TemporaryDocument & { filename?: string })[]> {
  const embedding = await embedText(query);
  const { filename, page } = await extractMetadata(query);

  const whereClauses = [];

  filename && whereClauses.push(`filename = '${filename}'`);
  page && whereClauses.push(`page = ${page}`);

  const whereClause = whereClauses.join(" AND ");

  const searchQuery = `
    SELECT content, filename, page
    FROM documents
    ${whereClause ? `WHERE ${whereClause}` : ""}
    ORDER BY embedding <#> $1::vector
    LIMIT 5
  `;

  const results = await prisma.$queryRawUnsafe<
    (TemporaryDocument & { filename?: string })[]
  >(searchQuery, embedding);

  return results;
}
