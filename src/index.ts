import express = require("express");
import { configDotenv } from "dotenv";
import { json } from "express";
import AppDataSource from "./database/data-source";
import { RestoreToken } from "./database/entities/RestoreToken";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { sessionMiddleware } from "./middlewares/session.middleware";
import { AuthController } from "./modules/auth/controllers/auth.controller";
import { BORouter } from "./routes/backOffice";

configDotenv();

const app = express();
app.use(json());

declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      name: string;
    };
  }
}

app.use(corsMiddleware);
app.use(sessionMiddleware);

const main = async () => {
  await AppDataSource.initialize();

  app.get("/", async (req, res) => {
    const data = await RestoreToken.find();

    res.json({
      message: "Hello World",
      data,
    });
  });

  app.post("/login", AuthController.loginUser);
  app.post("/restore-pwd", AuthController.restorePwd);
  app.use("/admin", BORouter);

  app.use(errorMiddleware);

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

main();
