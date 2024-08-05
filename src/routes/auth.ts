import express = require("express");
import { AuthController } from "../modules/auth/controllers/auth.controller";

export const authRoute = express.Router();

authRoute.post("/signup", AuthController.singup);
