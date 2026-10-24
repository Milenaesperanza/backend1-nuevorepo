export const createServicesController = (servicesService) => ({
  getServices(request, response) {
    const services = servicesService.getServices({
      category: request.query.category,
      available: request.query.available,
      search: request.query.search,
    });

    response.status(200).json(services);
  },

  getServiceById(request, response) {
    const service = servicesService.getServiceById(request.params.sid);
    response.status(service ? 200 : 404).json(service ?? { error: 'Servicio no encontrado.' });
  },

  createService(request, response) {
    response.status(201).json(servicesService.createService(request.body));
  },

  updateService(request, response) {
    const service = servicesService.updateService(request.params.sid, request.body);
    response.status(service ? 200 : 404).json(service ?? { error: 'Servicio no encontrado.' });
  },

  deleteService(request, response) {
    const service = servicesService.deleteService(request.params.sid);
    response.status(service ? 200 : 404).json(service ?? { error: 'Servicio no encontrado.' });
  },
});
