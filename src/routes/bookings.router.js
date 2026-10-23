import express from 'express';
import { createBookingsController } from '../controllers/bookings.controller.js';

export const createBookingsRouter = (bookingManager, serviceManager) => {
  const router = express.Router();
  const controller = createBookingsController(bookingManager, serviceManager);

  router.post('/', controller.createBooking);
  router.get('/:bid', controller.getBookingById);
  router.post('/:bid/services/:sid', controller.addServiceToBooking);

  return router;
};
