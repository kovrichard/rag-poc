import { type NextFunction, type Request, type Response } from "express";
import multer from "multer";

export const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8080"],
  optionsSuccessStatus: 200,
};

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Missing access token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (token !== process.env.SECRET) {
    res.status(403).json({ message: "Invalid access token" });
    return;
  }

  next();
}

export const uploadMiddleware = multer({
  dest: "uploads/",
  fileFilter: (_req: Request, file, cb) => {
    if (file.mimetype !== "application/pdf" && file.mimetype !== "text/plain") {
      cb(new Error("File type not supported"));
    } else {
      cb(null, true);
    }
  },
});
