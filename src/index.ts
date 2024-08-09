import express = require("express");
import { configDotenv } from "dotenv";
import { json } from "express";
import AppDataSource from "./database/data-source";
import { Package } from "./database/entities/Package";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { dbmiddleware } from "./middlewares/dberror.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { sessionMiddleware } from "./middlewares/session.middleware";
import { authRoute } from "./routes/auth";
import { BORouter } from "./routes/backOffice";
import { loginRouter } from "./routes/login";
import { packageRouter } from "./routes/package.route";
import { quizRouter } from "./routes/quiz.route";

configDotenv();

const app = express();
app.use(json());

declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      name: string;
    };
  }
}

app.use(corsMiddleware);
app.use(sessionMiddleware);

const main = async () => {
  await AppDataSource.initialize();

  app.get("/", async (req, res) => {
    const data = await Package.getRepository()
      .createQueryBuilder("packages")
      .select("*")
      .getMany();

    res.json({
      message: "Hello World",
      data,
    });
  });

  app.use("/login", loginRouter);
  app.use("/auth", authRoute);
  app.use("/admin", BORouter);
  app.use("/quizs", quizRouter);
  app.use("/packages", packageRouter);

  app.use(dbmiddleware);
  app.use(errorMiddleware);

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

main();
