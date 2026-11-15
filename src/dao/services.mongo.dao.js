import { ServiceModel } from '../models/service.model.js';

const toPublicService = (service) => {
  if (!service) return null;

  const plainService = service?.toObject?.() ?? service;
  const { _id, ...publicService } = plainService;
  return publicService;
};

export class ServicesMongoDao {
  async getAll() {
    const services = await ServiceModel.find().lean();
    return services.map(toPublicService);
  }

  async getById(id) {
    return toPublicService(await ServiceModel.findOne({ id }).lean());
  }

  async getDocumentById(id) {
    return ServiceModel.findOne({ id }).lean();
  }

  async getByMongoId(id) {
    return ServiceModel.findById(id).lean();
  }

  async create(service) {
    const createdService = await ServiceModel.create(service);
    return toPublicService(createdService);
  }

  async update(id, service) {
    return ServiceModel.findOneAndUpdate({ id }, service, {
      returnDocument: 'after',
      runValidators: true,
    }).lean().then(toPublicService);
  }

  async delete(id) {
    return ServiceModel.findOneAndDelete({ id }).lean().then(toPublicService);
  }
}
