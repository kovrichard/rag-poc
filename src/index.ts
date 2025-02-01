import express, { type Request, type Response } from "express";
import conf from "./lib/config";
import { searchHandler } from "./routes/search";
import { uploadHandler } from "./routes/upload";

const app = express();

app.post("/upload", uploadHandler);
app.get("/search", searchHandler);

app.use((_req: Request, res: Response) => {
  res.status(405).send("Method Not Allowed");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${conf.scheme}://${conf.authority}`);
});
