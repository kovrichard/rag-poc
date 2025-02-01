import OpenAI from "openai";

const MODEL = "text-embedding-3-large";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text: string): Promise<number[]> {
  const response = await openaiClient.embeddings.create({
    model: MODEL,
    input: text,
  });

  return response.data[0].embedding;
}
