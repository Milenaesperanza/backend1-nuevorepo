import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const defaultDataPath = resolve(currentDirectory, '../data/services.json');

export class ServicesDao {
  constructor(dataPath = defaultDataPath) {
    this.dataPath = resolve(dataPath);
    this.services = this.#load();
  }

  getAll() {
    return this.services;
  }

  getById(id) {
    return this.services.find((service) => service.id === id) ?? null;
  }

  create(service) {
    this.services.push(service);
    this.#save();
    return service;
  }

  update(id, service) {
    const index = this.services.findIndex((item) => item.id === id);
    if (index === -1) return null;

    this.services[index] = service;
    this.#save();
    return service;
  }

  delete(id) {
    const service = this.getById(id);
    if (!service) return null;

    this.services = this.services.filter((item) => item.id !== id);
    this.#save();
    return service;
  }

  #load() {
    if (!existsSync(this.dataPath)) {
      throw new Error(`No se encontró el archivo de servicios: ${this.dataPath}`);
    }

    try {
      const services = JSON.parse(readFileSync(this.dataPath, 'utf8'));
      if (!Array.isArray(services)) {
        throw new Error('El archivo debe contener un array de servicios.');
      }
      return services;
    } catch (error) {
      throw new Error(`No se pudo cargar el catálogo de servicios: ${error.message}`);
    }
  }

  #save() {
    writeFileSync(this.dataPath, `${JSON.stringify(this.services, null, 2)}\n`, 'utf8');
  }
}
