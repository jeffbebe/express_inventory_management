import { NextFunction, Request, Response } from "express";
import { HttpException } from "../errors/http.error";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpException) {
    res.status(err.code).json(err.reason);
    return;
  }
  console.error(err instanceof Error ? err.stack : JSON.stringify(err));

  res.status(500).json({ message: "Internal server error" });
}
