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
