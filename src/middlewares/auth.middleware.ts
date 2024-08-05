import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized",
    });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          error: "Unauthorized",
        });
      }
      req.session.user = {
        id: decoded.user,
        name: decoded.name,
      };
      next();
    });
  }
};
