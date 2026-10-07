import { Router } from 'express';
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from '../controllers/customerController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export const customerRoutes = Router();

customerRoutes.use(authenticate);
customerRoutes.get('/', listCustomers);
customerRoutes.post('/', createCustomer);
customerRoutes.get('/:id', getCustomer);
customerRoutes.put('/:id', updateCustomer);
customerRoutes.patch('/:id', updateCustomer);
customerRoutes.delete('/:id', deleteCustomer);
