import cors from "cors";
import express, { type Request, type Response } from "express";
import multer from "multer";
import conf from "./lib/config";
import { searchHandler } from "./routes/search";
import { uploadHandler } from "./routes/upload";

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8080"],
  optionsSuccessStatus: 200,
};

const upload = multer({ dest: "uploads/" });

const app = express();

app.use("*", cors(corsOptions));

app.post("/upload", upload.single("document"), uploadHandler);
app.get("/search", searchHandler);

app.use((_req: Request, res: Response) => {
  res.status(405).send("Method Not Allowed");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${conf.scheme}://${conf.authority}`);
});
