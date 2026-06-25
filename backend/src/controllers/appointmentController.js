import { Appointment } from "../models/Appointment.js";
import { Customer } from "../models/Customer.js";
import { serializeAppointment } from "../serializers/appointmentSerializer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { dateOnlyRange, parseDateOnly } from "../utils/date.js";
import { HttpError } from "../utils/httpError.js";

const appointmentPayload = (body) => ({
  customerId: body.customerId,
  date: parseDateOnly(body.date),
  time: body.time,
  description: body.description || "",
  status: body.status || "scheduled",
});

export const listAppointments = asyncHandler(async (req, res) => {
  const filter = { deletedAt: null };

  if (req.query.customerId) {
    filter.customerId = req.query.customerId;
  }

  if (req.query.date) {
    filter.date = dateOnlyRange(req.query.date);
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const appointments = await Appointment.find(filter).sort({
    date: 1,
    time: 1,
  });

  res.json(appointments.map(serializeAppointment));
});

export const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    deletedAt: null,
  });

  if (!appointment) {
    throw new HttpError(404, "Appointment not found.");
  }

  res.json(serializeAppointment(appointment));
});

export const createAppointment = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.body.customerId,
    deletedAt: null,
  });

  if (!customer) {
    throw new HttpError(404, "Customer not found.");
  }

  const appointment = await Appointment.create(appointmentPayload(req.body));
  res.status(201).json(serializeAppointment(appointment));
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    appointmentPayload(req.body),
    { new: true, runValidators: true },
  );

  if (!appointment) {
    throw new HttpError(404, "Appointment not found.");
  }

  res.json(serializeAppointment(appointment));
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true },
  );

  if (!appointment) {
    throw new HttpError(404, "Appointment not found.");
  }

  res.json({ id: appointment.id, deletedAt: appointment.deletedAt });
});
