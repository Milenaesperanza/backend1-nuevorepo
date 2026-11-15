import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDatabase } from '../config/database.config.js';
import { env } from '../config/env.config.js';
import { ServiceModel } from '../models/service.model.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));
const dataPath = resolve(currentDirectory, '../data/services.json');

const seedServices = async () => {
  const services = JSON.parse(await readFile(dataPath, 'utf8'));

  await connectDatabase(env.mongoUri);

  const operations = services.map((service) => ({
    updateOne: {
      filter: { id: service.id },
      update: { $set: service },
      upsert: true,
    },
  }));

  const result = await ServiceModel.bulkWrite(operations, { ordered: false });
  console.log(
    `Servicios procesados: ${services.length}. ` +
      `Insertados: ${result.upsertedCount}. Actualizados: ${result.modifiedCount}.`
  );
};

try {
  await seedServices();
} catch (error) {
  console.error(`No se pudieron migrar los servicios: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (process.env.MONGO_URI) {
    const mongoose = await import('mongoose');
    await mongoose.default.disconnect();
  }
}
