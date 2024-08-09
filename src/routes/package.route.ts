import { Router } from "express";
import { PackageController } from "../modules/packages/controllers/package.controller";

export const packageRouter = Router();
packageRouter.get("", PackageController.getAllPackages);
