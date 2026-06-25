import { Customer } from "../models/Customer.js";
import { Note } from "../models/Note.js";
import { serializeNote } from "../serializers/noteSerializer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { dateOnlyRange, parseDateOnly } from "../utils/date.js";
import { HttpError } from "../utils/httpError.js";

const notePayload = (body) => ({
  customerId: body.customerId,
  date: parseDateOnly(body.date) || new Date(),
  title: body.title,
  content: body.content ?? body.note ?? "",
});

export const listNotes = asyncHandler(async (req, res) => {
  const filter = { deletedAt: null };

  if (req.query.customerId) {
    filter.customerId = req.query.customerId;
  }

  if (req.query.date) {
    filter.date = dateOnlyRange(req.query.date);
  }

  const notes = await Note.find(filter).sort({ date: -1, createdAt: -1 });
  res.json(notes.map(serializeNote));
});

export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, deletedAt: null });

  if (!note) {
    throw new HttpError(404, "Note not found.");
  }

  res.json(serializeNote(note));
});

export const createNote = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.body.customerId,
    deletedAt: null,
  });

  if (!customer) {
    throw new HttpError(404, "Customer not found.");
  }

  const note = await Note.create(notePayload(req.body));
  res.status(201).json(serializeNote(note));
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    notePayload(req.body),
    { new: true, runValidators: true },
  );

  if (!note) {
    throw new HttpError(404, "Note not found.");
  }

  res.json(serializeNote(note));
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true },
  );

  if (!note) {
    throw new HttpError(404, "Note not found.");
  }

  res.json({ id: note.id, deletedAt: note.deletedAt });
});
