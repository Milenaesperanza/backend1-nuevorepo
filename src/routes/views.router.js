import express from 'express';
import { createViewsController } from '../controllers/views.controller.js';

export const createViewsRouter = (servicesService, bookingsService) => {
  const router = express.Router();
  const controller = createViewsController(servicesService, bookingsService);

  router.get('/', controller.renderHome);
  router.get('/realtimeproducts', controller.renderRealtimeProducts);
  router.get('/services', controller.renderServices);
  router.get('/availability', controller.renderAvailability);
  router.get('/bookings', controller.renderBookings);

  return router;
};
