import { Router } from 'express';
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
} from '../controllers/appointmentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export const appointmentRoutes = Router();

appointmentRoutes.use(authenticate);
appointmentRoutes.get('/', listAppointments);
appointmentRoutes.post('/', createAppointment);
appointmentRoutes.get('/:id', getAppointment);
appointmentRoutes.put('/:id', updateAppointment);
appointmentRoutes.patch('/:id', updateAppointment);
appointmentRoutes.delete('/:id', deleteAppointment);
