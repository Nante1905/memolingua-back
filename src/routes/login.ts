import express = require("express");
import { AuthController } from "../modules/auth/controllers/auth.controller";
const router = express.Router();

router.post("", AuthController.loginUser);

export { router as loginRouter };
