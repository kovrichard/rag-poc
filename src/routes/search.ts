import { type Request, type Response } from "express";
export async function searchHandler(req: Request, res: Response): Promise<void> {
  const { query } = req.query;

  if (!query) {
    res.status(400).json({ message: "Query parameter is required" });
    return;
  }

  res.json({ query });
}
