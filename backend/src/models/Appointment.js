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
      default: null,
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
    endTime: {
      type: String,
      required: [true, "Appointment end time is required."],
      match: [
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Appointment end time is invalid.",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    color: {
      type: String,
      match: [/^#[0-9a-fA-F]{6}$/, "Appointment color is invalid."],
      default: "#24b7f2",
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
