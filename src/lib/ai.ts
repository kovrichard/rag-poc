import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const metadataSchema = z.object({
  title: z.string().optional(),
  filename: z.string().optional(),
  page: z.number().optional(),
  line: z.number().optional(),
});

const EMBEDDING_MODEL = "text-embedding-3-large";
const CHAT_MODEL = "gpt-4o-mini";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text: string): Promise<number[]> {
  const response = await openaiClient.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return response.data[0].embedding;
}

export async function extractMetadata(text: string): Promise<{
  title: string;
  filename: string;
  page: number;
  line: number;
}> {
  const response = await openaiClient.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Extract metadata from the following text if you find any. Metadata to extract includes title, filename, page, and line number. If a metadata cannot be extracted, return an empty string or 0, depending on the type.",
      },
      {
        role: "user",
        content: text,
      },
    ],
    response_format: zodResponseFormat(metadataSchema, "metadata"),
  });

  return JSON.parse(response.choices[0].message.content ?? "{}");
}
