import mongoose from "mongoose";
import { env } from "../config/env.js";

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier.";
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "Duplicated value.";
  }

  res.status(statusCode).json({
    message,
    ...(env.nodeEnv !== "production" ? { stack: error.stack } : {}),
  });
};
