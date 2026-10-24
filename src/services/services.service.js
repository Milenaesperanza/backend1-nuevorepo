export class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  getServices(filters = {}) {
    const { category, available, search } = filters;
    const normalizedSearch = search?.toLowerCase().trim();

    return this.repository.getAll().filter((service) => {
      const matchesCategory = category
        ? service.category.toLowerCase() === category.toLowerCase()
        : true;
      const matchesAvailable = available === undefined
        ? true
        : service.available === (available === true || available === 'true');
      const matchesSearch = normalizedSearch
        ? [service.name, service.description, service.category]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedSearch))
        : true;

      return matchesCategory && matchesAvailable && matchesSearch;
    });
  }

  getServiceById(id) {
    return this.repository.getById(id);
  }

  createService(serviceData) {
    if (serviceData?.id !== undefined) {
      throw new Error('El id se genera automáticamente y no debe enviarse al agregar un servicio.');
    }

    const service = {
      id: this.#nextId(),
      ...this.#normalizeService(serviceData),
    };
    return this.repository.create(service);
  }

  updateService(id, updatedData) {
    const currentService = this.repository.getById(id);
    if (!currentService) return null;

    if (updatedData?.id !== undefined && updatedData.id !== id) {
      throw new Error('El id de un servicio no se puede modificar.');
    }

    const updatedService = {
      id,
      ...this.#normalizeService({ ...currentService, ...updatedData, id }),
    };
    return this.repository.update(id, updatedService);
  }

  deleteService(id) {
    return this.repository.delete(id);
  }

  #normalizeService(service) {
    if (!service || typeof service !== 'object') {
      throw new Error('Los datos del servicio son obligatorios.');
    }

    const requiredFields = ['name', 'description', 'duration', 'price', 'category', 'available'];
    const missingFields = requiredFields.filter(
      (field) => service[field] === undefined || service[field] === null
    );
    if (missingFields.length > 0) {
      throw new Error(`Faltan propiedades obligatorias: ${missingFields.join(', ')}.`);
    }

    const normalized = {
      name: service.name?.trim(),
      description: service.description?.trim(),
      category: service.category?.trim(),
      price: Number(service.price),
      duration: Number(service.duration),
      available: service.available,
    };

    if (!normalized.name || !normalized.description || !normalized.category) {
      throw new Error('name, description y category no pueden estar vacíos.');
    }
    if (!Number.isFinite(normalized.price) || normalized.price < 0) {
      throw new Error('El precio del servicio debe ser un número mayor o igual a 0.');
    }
    if (!Number.isInteger(normalized.duration) || normalized.duration <= 0) {
      throw new Error('La duración debe ser un número entero mayor a 0.');
    }
    if (typeof normalized.available !== 'boolean') {
      throw new Error('available debe ser un valor booleano.');
    }

    return normalized;
  }

  #nextId() {
    const numericIds = this.repository
      .getAll()
      .map((service) => Number.parseInt(String(service.id).replace(/^service-/, ''), 10))
      .filter(Number.isInteger);
    const nextNumber = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    return `service-${nextNumber}`;
  }
}
