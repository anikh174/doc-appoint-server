const dotenv = require("dotenv");

dotenv.config();

function parseOriginList(value) {
  return value
    ? value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  CORS_ORIGINS: parseOriginList(process.env.CORS_ORIGIN) || [
    "http://localhost:3000",
    "https://doc-appoint-vert.vercel.app",
  ],
  IS_VERCEL: process.env.VERCEL === "1",
};

function validateEnv() {
  const missing = ["MONGODB_URI", "CLIENT_URL"].filter(
    (key) => !env[key],
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}`,
    );
  }
}

module.exports = { env, validateEnv };
