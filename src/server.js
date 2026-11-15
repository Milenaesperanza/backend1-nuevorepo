import { env } from './config/env.config.js';
import { connectDatabase } from './config/database.config.js';
import { app, servicesService, bookingsDao } from './app.js';

const startServer = async () => {
  try {
    await connectDatabase(env.mongoUri);

    const services = await servicesService.getServices();
    const bookings = await bookingsDao.getAll();

    app.listen(env.port, () => {
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
