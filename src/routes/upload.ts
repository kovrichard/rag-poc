import { type Request, type Response } from "express";

export async function uploadHandler(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ message: "File is required" });
    return;
  }

  res.json({ message: "File uploaded" });
}
