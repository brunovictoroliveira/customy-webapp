import { Router } from "express";
import {
  createNote,
  deleteNote,
  getNote,
  listNotes,
  updateNote,
} from "../controllers/noteController.js";

export const noteRoutes = Router();

noteRoutes.get("/", listNotes);
noteRoutes.post("/", createNote);
noteRoutes.get("/:id", getNote);
noteRoutes.put("/:id", updateNote);
noteRoutes.patch("/:id", updateNote);
noteRoutes.delete("/:id", deleteNote);
