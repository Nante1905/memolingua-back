import express = require("express");
import { configDotenv } from "dotenv";
import AppDataSource from "./database/data-source";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { sessionMiddleware } from "./middlewares/session.middleware";

configDotenv();

const app = express();

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

  app.get("/", (req, res) => {
    res.json({
      message: "Hello World",
    });
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

main();

