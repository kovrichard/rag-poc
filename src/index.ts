import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import conf from "./lib/config";
import { searchHandler } from "./routes/search";
import { uploadHandler } from "./routes/upload";

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8080"],
  optionsSuccessStatus: 200,
};

const upload = multer({
  dest: "uploads/",
  fileFilter: (_req: Request, file, cb) => {
    if (file.mimetype !== "application/pdf" && file.mimetype !== "text/plain") {
      cb(new Error("File type not supported"));
    } else {
      cb(null, true);
    }
  },
});

const app = express();

app.use("*", cors(corsOptions));

app.post("/upload", upload.single("document"), uploadHandler);
app.get("/search", searchHandler);

app.use((_req: Request, res: Response) => {
  res.status(405).send("Method Not Allowed");
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(400).json({ message: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${conf.scheme}://${conf.authority}`);
});
