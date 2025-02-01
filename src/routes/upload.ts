import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { type Request, type Response } from "express";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { embedDocument } from "../dao/documents";

export async function uploadHandler(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ message: "File is required" });
    return;
  }

  const { path, mimetype, originalname } = req.file;
  let data: string[];

  if (mimetype === "text/plain") {
    data = await prepareFile(new TextLoader(path));
  } else if (mimetype === "application/pdf") {
    data = await prepareFile(new PDFLoader(path));
  } else {
    res.status(400).json({ message: "File type not supported" });
    return;
  }

  const storePromises = data.map((text: string) => embedDocument(text, originalname));
  await Promise.all(storePromises);

  res.json({ message: "File uploaded" });
}

async function prepareFile(loader: TextLoader | PDFLoader): Promise<string[]> {
  const parentDocuments = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: [" "],
  });

  const docs = await splitter.splitDocuments(parentDocuments);

  return docs.map((doc) => doc.pageContent);
}
