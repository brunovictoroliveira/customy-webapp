import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new HttpError(401, "Authentication token is required.");
  }

  const payload = jwt.verify(token, env.jwtSecret);
  const user = await User.findOne({
    _id: payload.sub,
    status: "active",
    deletedAt: null,
  }).select("-passwordHash -passwordResetTokenHash");

  if (!user) {
    throw new HttpError(401, "Invalid authentication token.");
  }

  req.user = user;
  next();
});
