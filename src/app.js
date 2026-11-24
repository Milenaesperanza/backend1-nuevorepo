import express from 'express';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { engine } from 'express-handlebars';
import { ServicesMongoDao } from './dao/services.mongo.dao.js';
import { BookingsMongoDao } from './dao/bookings.mongo.dao.js';
import { ServicesRepository } from './repositories/services.repository.js';
import { BookingsRepository } from './repositories/bookings.repository.js';
import { ServicesService } from './services/services.service.js';
import { BookingsService } from './services/bookings.service.js';
import { createServicesRouter } from './routes/services.router.js';
import { createBookingsRouter } from './routes/bookings.router.js';
import { createViewsRouter } from './routes/views.router.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

export const createApp = (
  servicesService = new ServicesService(new ServicesRepository(new ServicesMongoDao())),
  bookingsService = new BookingsService(
    new BookingsRepository(new BookingsMongoDao()),
    servicesService
  )
) => {
  const app = express();

  app.engine('handlebars', engine({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');
  app.set('views', resolve(currentDirectory, '../views'));

  app.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
  });

  app.use(express.json());
  app.use(express.static(resolve(currentDirectory, '../public')));

  app.use('/api/services', createServicesRouter(servicesService));
  app.use('/api/bookings', createBookingsRouter(bookingsService));
  app.use('/', createViewsRouter(servicesService, bookingsService));
  app.use('/views', createViewsRouter(servicesService, bookingsService));

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

export const servicesDao = new ServicesMongoDao();
export const bookingsDao = new BookingsMongoDao();
export const servicesRepository = new ServicesRepository(servicesDao);
export const bookingsRepository = new BookingsRepository(bookingsDao);
export const servicesService = new ServicesService(servicesRepository);
export const bookingsService = new BookingsService(bookingsRepository, servicesService);
export const app = createApp(servicesService, bookingsService);
