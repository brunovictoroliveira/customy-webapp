import { Appointment } from "../models/Appointment.js";
import { Customer } from "../models/Customer.js";
import { Note } from "../models/Note.js";
import { serializeCustomer } from "../serializers/customerSerializer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { compactObject } from "../utils/sanitize.js";

const customerPayload = (body) =>
  compactObject({
    name: body.name,
    phone: body.phone || "",
    email: body.email || "",
    socialProfile: body.socialProfile || "",
    birthDate: body.birthDate || null,
    observation: body.observation || "",
    status: body.status,
  });

export const listCustomers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const filter = { deletedAt: null };

  if (q) {
    filter.name = { $regex: String(q), $options: "i" };
  }

  const customers = await Customer.find(filter).sort({ name: 1 });
  res.json(customers.map(serializeCustomer));
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    deletedAt: null,
  });

  if (!customer) {
    throw new HttpError(404, "Customer not found.");
  }

  res.json(serializeCustomer(customer));
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(customerPayload(req.body));
  res.status(201).json(serializeCustomer(customer));
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    customerPayload(req.body),
    { new: true, runValidators: true },
  );

  if (!customer) {
    throw new HttpError(404, "Customer not found.");
  }

  res.json(serializeCustomer(customer));
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    deletedAt: null,
  });

  if (!customer) {
    throw new HttpError(404, "Customer not found.");
  }

  const deletedAt = new Date();
  customer.deletedAt = deletedAt;
  await customer.save();

  await Promise.all([
    Note.updateMany(
      { customerId: customer._id, deletedAt: null },
      { deletedAt },
    ),
    Appointment.updateMany(
      { customerId: customer._id, deletedAt: null },
      { deletedAt },
    ),
  ]);

  res.json({ id: customer.id, deletedAt });
});
