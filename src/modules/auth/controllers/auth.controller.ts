import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { EntityNotFoundError } from "typeorm";
import { ZodError } from "zod";
import {
  ADMIN_ROLE,
  USER_ROLE,
} from "../../../database/constants/user.constant";
import AppDataSource from "../../../database/data-source";
import { formatDate } from "../../../shared/services/formatter";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { logIn } from "../service/auth.service";
import {
  configureEmailOptions,
  generateAndSaveRestorePwdToken,
} from "../service/restore-pwd.service";
import { AuthCredentials } from "../types/auth.type";
import { authSchema } from "../validations/authSchema";
import { restorePwdSchema } from "../validations/restorePwdSchema";
import Mail = require("nodemailer/lib/mailer");

export class AuthController {
  static async restorePwd(req: Request, res: Response, next: NextFunction) {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      restorePwdSchema.parse(req.body);
      const { email } = req.body;
      queryRunner.startTransaction();
      const restoreToken = await generateAndSaveRestorePwdToken(
        email,
        queryRunner
      );

      const url = `${process.env.CLIENT_URL}/login/reset-password?t=${restoreToken.token}`;
      const { transporter, mailOptions } = configureEmailOptions(
        email,
        url,
        formatDate(restoreToken.expirationDate)
      );

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          queryRunner.rollbackTransaction();
          res.status(500).json(
            new ApiResponse({
              ok: false,
              error: `Impossible d'envoyer un à email à ${email}`,
            })
          );
        } else {
          queryRunner.commitTransaction();
          res.status(StatusCodes.OK).json(
            new ApiResponse({
              ok: true,
            })
          );
        }
      });
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
        res.status(StatusCodes.GATEWAY_TIMEOUT).json(
          new ApiResponse({
            ok: false,
            error: `Impossible d'envoyer un à email à ${req.body.email}`,
          })
        );
      } else {
        queryRunner.rollbackTransaction();
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
