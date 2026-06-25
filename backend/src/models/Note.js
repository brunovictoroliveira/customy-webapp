import mongoose from "mongoose";
import { schemaOptions } from "./schemaOptions.js";

const noteSchema = new mongoose.Schema(
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
      required: [true, "Note date is required."],
      default: Date.now,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Note title is required."],
      trim: true,
      maxlength: 160,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 20000,
      default: "",
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  schemaOptions,
);

noteSchema.index({ customerId: 1, date: -1 });
noteSchema.index({ ownerId: 1, date: -1 });
noteSchema.index({ organizationId: 1, date: -1 });

noteSchema.virtual("note").get(function getLegacyNoteField() {
  return this.content;
});

export const Note = mongoose.model("Note", noteSchema);
