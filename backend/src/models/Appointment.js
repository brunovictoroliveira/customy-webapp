import mongoose from "mongoose";
import { schemaOptions } from "./schemaOptions.js";

const appointmentSchema = new mongoose.Schema(
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
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required."],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required."],
      index: true,
    },
    time: {
      type: String,
      required: [true, "Appointment time is required."],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Appointment time is invalid."],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no_show"],
      default: "scheduled",
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

appointmentSchema.index({ ownerId: 1, date: 1, time: 1 });
appointmentSchema.index({ organizationId: 1, date: 1, time: 1 });
appointmentSchema.index({ customerId: 1, date: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
