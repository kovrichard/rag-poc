import { type Request, type Response } from "express";
import { searchDocuments } from "../dao/documents";
export async function searchHandler(req: Request, res: Response): Promise<void> {
  const { query } = req.query;

  if (!query) {
    res.status(400).json({ message: "Query parameter is required" });
    return;
  }

  const documents = await searchDocuments(query as string);

  res.json({ documents });
}
