import { NextFunction, Request, Response } from "express";
import { PAGINATION_SIZE } from "../../../shared/constant/entity-state.constant";
import { getPublicPackages } from "../services/packages.service";

export class PackageController {
  static async getAllPackages(req: Request, res: Response, next: NextFunction) {
    const { theme, lang, page, pageSize } = req.query;
    const numeroPage = parseInt(page as string);
    const paginationSize = parseInt(pageSize as string);

    const packages = await getPublicPackages(lang as string, theme as string, {
      numero: isNaN(numeroPage) ? 1 : numeroPage,
      size: isNaN(paginationSize) ? PAGINATION_SIZE : paginationSize,
    });
    res.json(packages);
  }
}
