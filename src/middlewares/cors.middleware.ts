import cors = require("cors");

const CORS_CONFIG = {
  origin: "",
};

export const corsMiddleware = cors(CORS_CONFIG);
