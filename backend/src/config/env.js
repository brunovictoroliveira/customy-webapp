import dotenv from "dotenv";

dotenv.config();

const requiredInProduction = ["MONGODB_URI", "JWT_SECRET"];

if (process.env.NODE_ENV === "production") {
  const missingVars = requiredInProduction.filter(
    (key) => !process.env[key] || process.env[key].trim() === "",
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
}

const defaultCorsOrigins = [
  "http://localhost:4000",
  "http://localhost:5173",
  "http://127.0.0.1:4000",
  "http://127.0.0.1:5173",
];

const corsOrigins = (process.env.CORS_ORIGIN || defaultCorsOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/customy_webapp",
  jwtSecret: process.env.JWT_SECRET || "customy-dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigins,
};
