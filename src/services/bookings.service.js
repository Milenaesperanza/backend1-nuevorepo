export class BookingsService {
  constructor(repository, servicesService) {
    this.repository = repository;
    this.servicesService = servicesService;
  }

  async createBooking(bookingData) {
    if (bookingData?.id !== undefined) {
      throw new Error('El id se genera automáticamente y no debe enviarse al crear una reserva.');
    }

    const booking = {
      id: await this.#nextId(),
      ...await this.#normalizeBooking(bookingData),
    };
    return this.#toExternalBooking(await this.repository.create(booking));
  }

  async getBookingById(id) {
    const booking = await this.repository.getById(id);
    return this.#toExternalBooking(booking);
  }

  async addServiceToBooking(bookingId, serviceId) {
    const booking = await this.repository.getById(bookingId);
    const service = await this.servicesService.getServiceDocumentById(serviceId);
    if (!booking || !service) return null;

    const serviceReference = service._id;

    const bookingService = booking.services.find(
      (item) => item.service.toString() === serviceReference.toString()
    );
    if (bookingService) bookingService.quantity += 1;
    else booking.services.push({ service: serviceReference, quantity: 1 });

    return this.#toExternalBooking(await this.repository.update(bookingId, booking));
  }

  async #normalizeBooking(booking) {
    if (!booking || typeof booking !== 'object') {
      throw new Error('Los datos de la reserva son obligatorios.');
    }

    const requiredFields = ['clientName', 'clientEmail', 'date', 'time', 'status'];
    const missingFields = requiredFields.filter(
      (field) => booking[field] === undefined || booking[field] === null
    );
    if (missingFields.length > 0) {
      throw new Error(`Faltan propiedades obligatorias: ${missingFields.join(', ')}.`);
    }

    const normalized = {
      clientName: this.#requiredText(booking.clientName, 'clientName'),
      clientEmail: this.#requiredText(booking.clientEmail, 'clientEmail'),
      date: this.#requiredText(booking.date, 'date'),
      time: this.#requiredText(booking.time, 'time'),
      status: this.#requiredText(booking.status, 'status'),
      services: booking.services ?? [],
    };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.clientEmail)) {
      throw new Error('clientEmail debe ser un email válido.');
    }
    if (!Array.isArray(normalized.services)) throw new Error('services debe ser un array.');
    normalized.services = await this.#normalizeServices(normalized.services);
    return normalized;
  }

  async #normalizeServices(services) {
    const normalizedServices = [];
    for (const item of services) {
      if (!item || typeof item !== 'object' || typeof item.service !== 'string') {
        throw new Error('Cada servicio de una reserva debe tener un id en service.');
      }
      const service = await this.servicesService.getServiceDocumentById(item.service);
      if (!service) {
        throw new Error(`El servicio ${item.service} no existe.`);
      }

      const quantity = item.quantity ?? 1;
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error('La quantity de un servicio debe ser un entero mayor a 0.');
      }

      const existing = normalizedServices.find(
        (normalizedService) => normalizedService.service.toString() === service._id.toString()
      );
      if (existing) existing.quantity += quantity;
      else normalizedServices.push({ service: service._id, quantity });
    }
    return normalizedServices;
  }

  async #toExternalBooking(booking) {
    if (!booking) return null;

    const services = await Promise.all(
      booking.services.map(async (item) => {
        const service = await this.servicesService.getServiceByMongoId(item.service);
        return {
          service: service?.id ?? item.service.toString(),
          quantity: item.quantity,
        };
      })
    );

    return { ...booking, services };
  }

  #requiredText(value, field) {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`${field} debe ser un texto no vacío.`);
    }
    return value.trim();
  }

  async #nextId() {
    const bookings = await this.repository.getAll();
    const numericIds = bookings
      .map((booking) => Number.parseInt(String(booking.id).replace(/^booking-/, ''), 10))
      .filter(Number.isInteger);
    const nextNumber = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    return `booking-${nextNumber}`;
  }
}
