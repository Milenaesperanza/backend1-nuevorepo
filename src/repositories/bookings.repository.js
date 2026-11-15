export class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async create(booking) {
    return this.dao.create(booking);
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async getAll() {
    return this.dao.getAll();
  }

  async update(id, booking) {
    return this.dao.update(id, booking);
  }
}
