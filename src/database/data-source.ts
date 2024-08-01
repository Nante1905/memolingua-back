import { configDotenv } from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";

configDotenv();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: ["query"],
  entities: [__dirname + "/entities/**/*{.ts, .js}"],
  migrations: [__dirname + "/migrations/**/*{.ts, .js}"],
  subscribers: [],
});

export default AppDataSource;
