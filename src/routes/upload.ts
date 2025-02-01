import fs from "fs";
import { type Request, type Response } from "express";
import { embedDocument } from "../dao/documents";

export async function uploadHandler(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ message: "File is required" });
    return;
  }

  const { path } = req.file;

  const data = fs.readFileSync(path, "utf8");
  await embedDocument(data);

  res.json({ message: "File uploaded" });
}
