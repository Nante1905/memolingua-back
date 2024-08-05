import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError } from "jsonwebtoken";
import { EntityNotFoundError } from "typeorm";
import { ZodError } from "zod";
import {
  ADMIN_ROLE,
  USER_ROLE,
} from "../../../database/constants/user.constant";
import AppDataSource from "../../../database/data-source";
import { apiErrors } from "../../../shared/constant/api-error.constant";
import { formatDate } from "../../../shared/services/formatter";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { logIn } from "../service/auth.service";
import {
  configureEmailOptions,
  generateAndSaveRestorePwdToken,
  restorePwd,
} from "../service/restore-pwd.service";
import { AuthCredentials } from "../types/auth.type";
import { authSchema } from "../validations/authSchema";

export class AuthController {
  static async restorePwd(req: Request, res: Response, next: NextFunction) {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      const { token, password, confirmPassword } = req.body;
      await queryRunner.startTransaction();

      await restorePwd(token, password, queryRunner);
      await queryRunner.commitTransaction();
      res.status(StatusCodes.CREATED).json();
    } catch (error) {
      if (
        error instanceof EntityNotFoundError ||
        error instanceof JsonWebTokenError
      ) {
        await queryRunner.commitTransaction(); //commit delete of token
        res.status(StatusCodes.FORBIDDEN).json(
          new ApiResponse({
            ok: false,
            error: `Token invalide`,
          })
        );
      } else {
        await queryRunner.rollbackTransaction();
        next(error);
      }
    }
  }

  static async requestPwdRestoration(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      const { email } = req.body;
      await queryRunner.startTransaction();
      const restoreToken = await generateAndSaveRestorePwdToken(
        email,
        queryRunner
      );

      // send email
      const url = `${process.env.CLIENT_URL}/login/reset-password?t=${restoreToken.token}`;
      const { transporter, mailOptions } = configureEmailOptions(
        email,
        url,
        formatDate(restoreToken.expirationDate)
      );

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          await queryRunner.rollbackTransaction();
          res.status(500).json(
            new ApiResponse({
              ok: false,
              error: apiErrors.fr.sendEmailError(email),
            })
          );
        } else {
          await queryRunner.commitTransaction();
          res.status(StatusCodes.OK).json(
            new ApiResponse({
              ok: true,
            })
          );
        }
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        res.status(StatusCodes.GATEWAY_TIMEOUT).json(
          new ApiResponse({
            ok: false,
            error: apiErrors.fr.sendEmailError(req.body.email),
          })
        );
      } else {
        await queryRunner.rollbackTransaction();
        next(error);
      }
    }
  }

  static async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
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
          .json(new ApiResponse({ ok: false, error: errors }));
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
