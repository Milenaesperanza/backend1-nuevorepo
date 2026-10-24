import { env } from './config/env.config.js';
import { app, servicesService, bookingsDao } from './app.js';

app.listen(env.port, () => {
  console.log(`Manada Servicios iniciado en http://localhost:${env.port}`);
  console.log(`Entorno: ${env.nodeEnv}`);
  console.log(`Servicios cargados: ${servicesService.getServices().length}`);
  console.log(`Reservas cargadas: ${bookingsDao.getAll().length}`);
});
