export const createServicesController = (servicesService) => ({
  async getServices(request, response) {
    const services = await servicesService.getServices({
      category: request.query.category,
      available: request.query.available,
      search: request.query.search,
    });

    response.status(200).json(services);
  },

  async getServiceById(request, response) {
    const service = await servicesService.getServiceById(request.params.sid);
    response.status(service ? 200 : 404).json(service ?? { error: 'Servicio no encontrado.' });
  },

  async createService(request, response) {
    response.status(201).json(await servicesService.createService(request.body));
  },

  async updateService(request, response) {
    const service = await servicesService.updateService(request.params.sid, request.body);
    response.status(service ? 200 : 404).json(service ?? { error: 'Servicio no encontrado.' });
  },

  async deleteService(request, response) {
    const service = await servicesService.deleteService(request.params.sid);
    response.status(service ? 200 : 404).json(service ?? { error: 'Servicio no encontrado.' });
  },
});
