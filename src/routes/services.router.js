import express from 'express';
import { createServicesController } from '../controllers/services.controller.js';

export const createServicesRouter = (servicesService) => {
  const router = express.Router();
  const controller = createServicesController(servicesService);

  router.get('/', controller.getServices);
  router.post('/', controller.createService);
  router.get('/:sid', controller.getServiceById);
  router.put('/:sid', controller.updateService);
  router.delete('/:sid', controller.deleteService);

  return router;
};
