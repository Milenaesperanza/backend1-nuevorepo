import { env } from './config/env.config.js';
import { connectDatabase } from './config/database.config.js';
import { app, servicesService, bookingsDao } from './app.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

io.on('connection', async (socket) => {
  try {
    socket.emit('services:updated', await servicesService.getServices());
  } catch (error) {
    socket.emit('server:error', { message: error.message });
  }

  socket.on('service:toggle-availability', async (payload, acknowledge = () => {}) => {
    try {
      const { id, available } = payload ?? {};
      if (typeof id !== 'string' || typeof available !== 'boolean') {
        throw new Error('id y available son obligatorios.');
      }

      const service = await servicesService.getServiceById(id);
      if (!service) throw new Error('Servicio no encontrado.');

      await servicesService.updateService(id, { ...service, available });
      const services = await servicesService.getServices();
      io.emit('services:updated', services);
      acknowledge({ ok: true });
    } catch (error) {
      acknowledge({ ok: false, error: error.message });
      socket.emit('server:error', { message: error.message });
    }
  });

  socket.on('service:create', async (payload, acknowledge = () => {}) => {
    try {
      await servicesService.createService(payload);
      io.emit('services:updated', await servicesService.getServices());
      acknowledge({ ok: true });
    } catch (error) {
      acknowledge({ ok: false, error: error.message });
      socket.emit('server:error', { message: error.message });
    }
  });

  socket.on('service:delete', async (payload, acknowledge = () => {}) => {
    try {
      const service = await servicesService.deleteService(payload?.id);
      if (!service) throw new Error('Servicio no encontrado.');
      io.emit('services:updated', await servicesService.getServices());
      acknowledge({ ok: true });
    } catch (error) {
      acknowledge({ ok: false, error: error.message });
      socket.emit('server:error', { message: error.message });
    }
  });
});

const startServer = async () => {
  try {
    await connectDatabase(env.mongoUri);

    const services = await servicesService.getServices();
    const bookings = await bookingsDao.getAll();

    httpServer.listen(env.port, () => {
      console.log(`Manada Servicios iniciado en http://localhost:${env.port}`);
      console.log(`Entorno: ${env.nodeEnv}`);
      console.log(`Servicios cargados: ${services.length}`);
      console.log(`Reservas cargadas: ${bookings.length}`);
    });
  } catch (error) {
    console.error(`No se pudo conectar a MongoDB: ${error.message}`);
    process.exitCode = 1;
  }
};

startServer();
