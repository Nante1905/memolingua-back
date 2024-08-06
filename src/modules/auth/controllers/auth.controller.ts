import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { EntityNotFoundError } from "typeorm";
import { ZodError } from "zod";
import {
  ADMIN_ROLE,
  USER_ROLE,
} from "../../../database/constants/user.constant";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import {
  getMe,
  logIn,
  signup,
  updatePassword,
  updateProfile,
} from "../service/auth.service";
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

  static async singup(req: Request, res: Response, next) {
    try {
      const user = req.body;
      const newUser = await signup(user);
      console.log(user);

      res.json(
        new ApiResponse({
          ok: true,
          message: "Inscrit",
          payload: newUser,
        })
      );
    } catch (e) {
      next(e);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await getMe(req.session.user.id);
      res.json(new ApiResponse({ payload: user }));
    } catch (error) {
      next(error);
    }
  }
  static async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await updateProfile(req.body, req.session.user.id);
      res.json(
        new ApiResponse({ payload: user, message: "Informations modifiées" })
      );
    } catch (error) {
      next(error);
    }
  }

  static async updatePwd(req: Request, res: Response, next: NextFunction) {
    try {
      await updatePassword(req.body, req.session.user.id);
      res.json(new ApiResponse({ message: "Mot de passe modifié" }));
    } catch (error) {
      // console.log();
      if (error instanceof EntityNotFoundError) {
        res.status(StatusCodes.BAD_REQUEST).json(
          new ApiResponse({
            ok: false,
            error: "Ancien mot de passe invalide",
          })
        );
      } else {
        next(error);
      }
    }
  }
}
