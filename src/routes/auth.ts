import express = require("express");
import { authMiddleware } from "../middlewares/auth.middleware";
import { AuthController } from "../modules/auth/controllers/auth.controller";

export const authRoute = express.Router();

authRoute.post("/signup", AuthController.singup);
authRoute.get("/me", authMiddleware, AuthController.me);
authRoute.put("/me", authMiddleware, AuthController.updateUserProfile);
authRoute.post("/refresh-token", AuthController.refreshTokenHandler);
authRoute.post("/update-pwd", authMiddleware, AuthController.updatePwd);
