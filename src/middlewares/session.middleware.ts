import { configDotenv } from "dotenv";
import session = require("express-session");

configDotenv();

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
});
