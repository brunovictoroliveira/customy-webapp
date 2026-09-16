import bcrypt from "bcryptjs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Appointment } from "../models/Appointment.js";
import { Customer } from "../models/Customer.js";
import { Note } from "../models/Note.js";
import { Organization } from "../models/Organization.js";
import { User } from "../models/User.js";
import { parseDateOnly } from "../utils/date.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../../..");
const jsonPath = path.join(rootDir, "backend", "db.json");

const shouldReset = process.argv.includes("--reset");

if (!shouldReset) {
  console.error("Seed aborted. Run with --reset to replace development data.");
  process.exit(1);
}

const seed = async () => {
  await connectDatabase();

  const raw = await fs.readFile(jsonPath, "utf8");
  const data = JSON.parse(raw);

  await Promise.all([
    Appointment.deleteMany({}),
    Note.deleteMany({}),
    Customer.deleteMany({}),
    Organization.deleteMany({}),
    User.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(
    process.env.SEED_USER_PASSWORD || "12345678",
    12,
  );

  const user = await User.create({
    name: process.env.SEED_USER_NAME || "Usuário de Teste",
    document: process.env.SEED_USER_DOCUMENT || "00000000000",
    email: process.env.SEED_USER_EMAIL || "teste@email.com",
    passwordHash,
  });

  const organization = await Organization.create({
    name: process.env.SEED_ORGANIZATION_NAME || "Customy Demo",
    ownerId: user._id,
  });

  const customerIdMap = new Map();

  for (const item of data.customers || []) {
    const customer = await Customer.create({
      organizationId: organization._id,
      ownerId: user._id,
      name: item.name,
      phone: item.phone || "",
      email: item.email || "",
      birthDate: parseDateOnly(item.birthDate),
      observation: item.observation || "",
    });

    customerIdMap.set(String(item.id), customer._id);
  }

  for (const item of data.notes || []) {
    const customerId = customerIdMap.get(String(item.customerId));

    if (!customerId) {
      continue;
    }

    await Note.create({
      organizationId: organization._id,
      ownerId: user._id,
      customerId,
      date: parseDateOnly(item.date) || new Date(),
      title: item.title,
      content: item.note || item.content || "",
    });
  }

  for (const item of data.appointments || []) {
    const customerId = item.customerId
      ? customerIdMap.get(String(item.customerId))
      : null;

    if (item.customerId && !customerId) {
      continue;
    }

    await Appointment.create({
      organizationId: organization._id,
      ownerId: user._id,
      customerId,
      date: parseDateOnly(item.date),
      time: item.time,
      endTime: item.endTime || item.time,
      description: item.description || "",
      color: item.color || "#24b7f2",
      status: item.status || "scheduled",
    });
  }

  console.log("MongoDB seed completed.");
  console.log(`User: ${user.email}`);
  console.log(`Password: ${process.env.SEED_USER_PASSWORD || "12345678"}`);
};

seed()
  .catch((error) => {
    console.error("MongoDB seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
