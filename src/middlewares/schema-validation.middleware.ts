import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { ApiResponse } from "../shared/types/ApiResponse";

export const validateData = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: string[] = [];
        for (const issue of error.errors) {
          errors.push(issue.message);
        }
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(new ApiResponse({ ok: false, error: errors }));
      } else {
        next(error);
      }
    }
  };
};
