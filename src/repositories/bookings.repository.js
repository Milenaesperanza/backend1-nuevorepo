export class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(booking) {
    return this.dao.create(booking);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  getAll() {
    return this.dao.getAll();
  }

  update(id, booking) {
    return this.dao.update(id, booking);
  }
}
