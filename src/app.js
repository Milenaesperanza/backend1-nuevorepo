import express from 'express';
import { ServicesDao } from './dao/services.dao.js';
import { BookingsDao } from './dao/bookings.dao.js';
import { ServicesRepository } from './repositories/services.repository.js';
import { BookingsRepository } from './repositories/bookings.repository.js';
import { ServicesService } from './services/services.service.js';
import { BookingsService } from './services/bookings.service.js';
import { createServicesRouter } from './routes/services.router.js';
import { createBookingsRouter } from './routes/bookings.router.js';

export const createApp = (
  servicesService = new ServicesService(new ServicesRepository(new ServicesDao())),
  bookingsService = new BookingsService(
    new BookingsRepository(new BookingsDao()),
    servicesService
  )
) => {
  const app = express();

  app.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
  });

  app.use(express.json());

  app.use('/api/services', createServicesRouter(servicesService));
  app.use('/api/bookings', createBookingsRouter(bookingsService));

  app.use('/api/services', (request, response) => {
    response.status(405).json({ error: 'Método no permitido.' });
  });

  app.use((error, request, response, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      response.status(400).json({ error: 'El cuerpo de la solicitud debe contener JSON válido.' });
      return;
    }

    if (response.headersSent) {
      next(error);
      return;
    }

    response.status(400).json({ error: error.message });
  });

  return app;
};

export const servicesDao = new ServicesDao();
export const bookingsDao = new BookingsDao();
export const servicesRepository = new ServicesRepository(servicesDao);
export const bookingsRepository = new BookingsRepository(bookingsDao);
export const servicesService = new ServicesService(servicesRepository);
export const bookingsService = new BookingsService(bookingsRepository, servicesService);
export const app = createApp(servicesService, bookingsService);
