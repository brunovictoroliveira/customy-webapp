import { Router } from "express";
import { appointmentRoutes } from "./appointmentRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { customerRoutes } from "./customerRoutes.js";
import { noteRoutes } from "./noteRoutes.js";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/customers", customerRoutes);
routes.use("/notes", noteRoutes);
routes.use("/appointments", appointmentRoutes);
