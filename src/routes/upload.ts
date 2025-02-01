import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { type Request, type Response } from "express";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { embedDocument } from "../dao/documents";
import type { TemporaryDocument } from "../lib/types";

export async function uploadHandler(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ message: "File is required" });
    return;
  }

  const { path, mimetype, originalname } = req.file;
  let docs: TemporaryDocument[];

  if (mimetype === "text/plain") {
    docs = await prepareFile(new TextLoader(path));
  } else if (mimetype === "application/pdf") {
    docs = await prepareFile(new PDFLoader(path));
  } else {
    res.status(400).json({ message: "File type not supported" });
    return;
  }

  const embedPromises = docs.map((doc: TemporaryDocument) =>
    embedDocument(doc, originalname)
  );
  await Promise.all(embedPromises);

  res.json({ message: "File uploaded" });
}

async function prepareFile(loader: TextLoader | PDFLoader): Promise<TemporaryDocument[]> {
  const parentDocuments = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: [" "],
  });

  const docs = await splitter.splitDocuments(parentDocuments);

  return docs.map((doc) => ({
    content: cleanText(doc.pageContent),
    page: doc.metadata.loc.pageNumber,
  }));
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
