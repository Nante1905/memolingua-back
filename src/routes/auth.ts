import express = require("express");
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateData } from "../middlewares/schema-validation.middleware";
import { AuthController } from "../modules/auth/controllers/auth.controller";
import {
  requestPwdRestoreSchema,
  restorePwdSchema,
} from "../modules/auth/validations/restorePwdSchema";

export const authRoute = express.Router();

authRoute.post("/signup", AuthController.singup);
authRoute.get("/me", authMiddleware, AuthController.me);
authRoute.put("/me", authMiddleware, AuthController.updateUserProfile);
authRoute.post("/refresh-token", AuthController.refreshTokenHandler);
authRoute.post("/update-pwd", authMiddleware, AuthController.updatePwd);
authRoute.post(
  "/request-restore-pwd",
  validateData(requestPwdRestoreSchema),
  AuthController.requestPwdRestoration
);
authRoute.post(
  "/restore-pwd",
  validateData(restorePwdSchema),
  AuthController.restorePwd
);
