import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { findAllThemes } from "../service/theme.service";

export class ThemeController {
  static async getThemes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await findAllThemes();
      res.json(new ApiResponse({ ok: true, payload: data }));
      return;
    } catch (error) {
      //   res.json(new ApiResponse({ ok: false, error: error }));
      next(error);
    }
  }
}
