import mongoose from "mongoose";
import { schemaOptions } from "./schemaOptions.js";

const customerSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Customer name is required."],
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 32,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 180,
      default: "",
    },
    socialProfile: {
      type: String,
      trim: true,
      maxlength: 180,
      default: "",
    },
    birthDate: {
      type: Date,
      default: null,
    },
    observation: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  schemaOptions,
);

customerSchema.index({ organizationId: 1, name: 1 });
customerSchema.index({ ownerId: 1, name: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ email: 1 });

export const Customer = mongoose.model("Customer", customerSchema);
