export class ServicesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return this.dao.getAll();
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async getDocumentById(id) {
    return this.dao.getDocumentById(id);
  }

  async getByMongoId(id) {
    return this.dao.getByMongoId(id);
  }

  async create(service) {
    return this.dao.create(service);
  }

  async update(id, service) {
    return this.dao.update(id, service);
  }

  async delete(id) {
    return this.dao.delete(id);
  }
}
