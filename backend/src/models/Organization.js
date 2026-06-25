import mongoose from "mongoose";
import { schemaOptions } from "./schemaOptions.js";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required."],
      trim: true,
      maxlength: 120,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
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

organizationSchema.index({ ownerId: 1, name: 1 });

export const Organization = mongoose.model("Organization", organizationSchema);
