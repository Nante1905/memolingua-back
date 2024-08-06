import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error middleware ", error);

  return res.status(500).json({ err: "Erreur interne du serveur" });
};
