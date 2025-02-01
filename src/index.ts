import express, { type Request, type Response } from "express";
import conf from "./lib/config";

const app = express();

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${conf.scheme}://${conf.authority}`);
});
