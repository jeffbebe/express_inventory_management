import { Request, Response } from "express";
import { NotFoundException } from "../errors/not-found.error";

export const notFoundHandler = (_req: Request, _res: Response) => {
  throw new NotFoundException({
    message: "Whoops! It seems like you are lost",
  });
};
