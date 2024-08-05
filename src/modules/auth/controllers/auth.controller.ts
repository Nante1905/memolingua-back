import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { EntityNotFoundError } from "typeorm";
import { ZodError } from "zod";
import {
  ADMIN_ROLE,
  USER_ROLE,
} from "../../../database/constants/user.constant";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { logIn } from "../service/auth.service";
import { AuthCredentials } from "../types/auth.type";
import { authSchema } from "../validations/authSchema";

export class AuthController {
  static async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);

      // schema validation
      authSchema.parse(req.body);

      const { email, pwd } = req.body;
      const credentials: AuthCredentials = { email, pwd };
      const token = await logIn(credentials, USER_ROLE);
      res.status(StatusCodes.OK).json(new ApiResponse({ payload: token }));
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: string[] = [];
        for (const issue of error.errors) {
          errors.push(issue.message);
        }
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(new ApiResponse({ ok: false, payload: errors }));
      } else if (error instanceof EntityNotFoundError) {
        res.status(StatusCodes.FORBIDDEN).json(
          new ApiResponse({
            ok: false,
            error: "Email ou mot de passe incorrect",
          })
        );
      } else {
        next(error);
      }
    }
  }

  static async loginAdmin(req: Request, res: Response, next: NextFunction) {
    const { email, pwd } = req.body;
    const credentials: AuthCredentials = { email, pwd };
    try {
      const token = await logIn(credentials, ADMIN_ROLE);
      res.status(StatusCodes.OK).json(new ApiResponse({ payload: token }));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        res.status(StatusCodes.FORBIDDEN).json(
          new ApiResponse({
            ok: false,
            error: "Email ou mot de passe incorrect",
          })
        );
      } else {
        next(error);
      }
    }
  }
}
