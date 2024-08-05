import express = require("express");
import { AuthController } from "../modules/auth/controllers/auth.controller";

const router = express.Router();

router.post("/login", AuthController.loginAdmin);

export { router as BORouter };
