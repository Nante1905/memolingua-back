import express = require("express");
import { AuthController } from "../modules/auth/controllers/auth.controller";
const router = express.Router();

router.post("", AuthController.loginUser);
router.post("/request-restore-pwd", AuthController.requestPwdRestoration);
router.post("/restore-pwd", AuthController.restorePwd);

export { router as AuthRouter };
