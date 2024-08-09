import { Router } from "express";
import { ThemeController } from "../modules/theme/controller/theme.controller";

export const themeRouter = Router();

themeRouter.get("/", ThemeController.getThemes);
