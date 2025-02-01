import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import conf from "./lib/config";
import { authMiddleware, corsOptions, uploadMiddleware } from "./lib/middlewares";
import { searchHandler } from "./routes/search";
import { uploadHandler } from "./routes/upload";

const app = express();

app.use("*", cors(corsOptions));
app.use(authMiddleware);

app.post("/upload", uploadMiddleware.single("document"), uploadHandler);
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
