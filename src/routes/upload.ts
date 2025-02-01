import fs from "fs";
import { type Request, type Response } from "express";
import pdf from "pdf-parse";
import { embedDocument } from "../dao/documents";

export async function uploadHandler(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ message: "File is required" });
    return;
  }

  const { path, mimetype } = req.file;
  let data: string;

  if (mimetype === "text/plain") {
    data = prepareTxtFile(path);
  } else if (mimetype === "application/pdf") {
    data = await preparePdfFile(path);
  } else {
    res.status(400).json({ message: "File type not supported" });
    return;
  }

  await embedDocument(data);

  res.json({ message: "File uploaded" });
}

function prepareTxtFile(path: string): string {
  const data = fs.readFileSync(path, "utf8");

  return data;
}

async function preparePdfFile(path: string): Promise<string> {
  const file = fs.readFileSync(path);
  const data = await pdf(file);

  return data.text;
}
