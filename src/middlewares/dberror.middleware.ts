import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../shared/types/ApiResponse";

export const dbmiddleware = (err, req, res: Response, next) => {
  if (err) {
    if (err.code == 23505) {
      const issues = (err.detail as string).match(/\(([^)]+)\)/);
      res.status(StatusCodes.BAD_REQUEST).json(
        new ApiResponse({
          ok: false,
          error:
            `${issues[1]} existe déjà`.charAt(0).toUpperCase() +
            `${issues[1]} existe déjà`.slice(1),
        })
      );
    } else if (err.code == 23502) {
      res.status(StatusCodes.BAD_REQUEST).json(
        new ApiResponse({
          ok: false,
          error: `Violation de contrainte not null sur la colonne: ${err.column}`,
        })
      );
    } else {
      next(err);
    }
  } else {
    next();
  }
};
