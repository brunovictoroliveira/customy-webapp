import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Organization } from "../models/Organization.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const createToken = (user) => {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

export const register = asyncHandler(async (req, res) => {
  const { name, document = "", email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError(400, "Name, email and password are required.");
  }

  if (password.length < 8) {
    throw new HttpError(400, "Password must contain at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, document, email, passwordHash });

  await Organization.create({
    name,
    ownerId: user._id,
  });

  res.status(201).json({
    user: publicUser(user),
    token: createToken(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required.");
  }

  const user = await User.findOne({
    email: String(email).toLowerCase(),
    deletedAt: null,
    status: "active",
  });

  if (!user) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password.");
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.json({
    user: publicUser(user),
    token: createToken(user),
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new HttpError(400, "Email is required.");
  }

  const user = await User.findOne({
    email: String(email).toLowerCase(),
    deletedAt: null,
    status: "active",
  });

  if (!user) {
    res.json({
      message: "If the email exists, recovery instructions were generated.",
    });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 30);
  await user.save();

  res.json({
    message: "If the email exists, recovery instructions were generated.",
    ...(env.nodeEnv !== "production" ? { resetToken } : {}),
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new HttpError(400, "Token and password are required.");
  }

  if (password.length < 8) {
    throw new HttpError(400, "Password must contain at least 8 characters.");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
    deletedAt: null,
  }).select("+passwordResetTokenHash +passwordResetExpiresAt");

  if (!user) {
    throw new HttpError(400, "Invalid or expired recovery token.");
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.passwordResetTokenHash = null;
  user.passwordResetExpiresAt = null;
  await user.save();

  res.json({ message: "Password updated successfully." });
});
