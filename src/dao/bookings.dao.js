import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const defaultDataPath = resolve(currentDirectory, '../data/bookings.json');

export class BookingsDao {
  constructor(dataPath = defaultDataPath) {
    this.dataPath = resolve(dataPath);
    this.bookings = this.#load();
  }

  create(booking) {
    this.bookings.push(booking);
    this.#save();
    return booking;
  }

  getById(id) {
    return this.bookings.find((booking) => booking.id === id) ?? null;
  }

  update(id, booking) {
    const index = this.bookings.findIndex((item) => item.id === id);
    if (index === -1) return null;

    this.bookings[index] = booking;
    this.#save();
    return booking;
  }

  getAll() {
    return this.bookings;
  }

  #load() {
    if (!existsSync(this.dataPath)) {
      throw new Error(`No se encontró el archivo de reservas: ${this.dataPath}`);
    }

    try {
      const bookings = JSON.parse(readFileSync(this.dataPath, 'utf8'));
      if (!Array.isArray(bookings)) {
        throw new Error('El archivo debe contener un array de reservas.');
      }
      return bookings;
    } catch (error) {
      throw new Error(`No se pudieron cargar las reservas: ${error.message}`);
    }
  }

  #save() {
    writeFileSync(this.dataPath, `${JSON.stringify(this.bookings, null, 2)}\n`, 'utf8');
  }
}
