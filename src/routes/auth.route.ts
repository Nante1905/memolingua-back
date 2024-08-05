import express = require("express");
import { validateData } from "../middlewares/schema-validation.middleware";
import { AuthController } from "../modules/auth/controllers/auth.controller";
import {
  requestPwdRestoreSchema,
  restorePwdSchema,
} from "../modules/auth/validations/restorePwdSchema";
const router = express.Router();

router.post("", AuthController.loginUser);
router.post(
  "/request-restore-pwd",
  validateData(requestPwdRestoreSchema),
  AuthController.requestPwdRestoration
);
router.post(
  "/restore-pwd",
  validateData(restorePwdSchema),
  AuthController.restorePwd
);

export { router as AuthRouter };
