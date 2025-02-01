import { type Request, type Response } from "express";

export async function uploadHandler(_req: Request, res: Response): Promise<void> {
  res.json({ message: "Upload handler" });
}
