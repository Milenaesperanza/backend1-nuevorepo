export const createServicesController = (serviceManager) => ({
  getServices(request, response) {
    const services = serviceManager.getServices({
      category: request.query.category,
      available: request.query.available,
      search: request.query.search,
    });

    response.status(200).json(services);
  },

  getServiceById(request, response) {
    const service = serviceManager.getServiceById(request.params.sid);
    response.status(service ? 200 : 404).json(service ?? { error: 'Servicio no encontrado.' });
  },

  createService(request, response) {
    response.status(201).json(serviceManager.addService(request.body));
  },

  updateService(request, response) {
    const service = serviceManager.updateService(request.params.sid, request.body);
    response.status(service ? 200 : 404).json(service ?? { error: 'Servicio no encontrado.' });
  },

  deleteService(request, response) {
    const service = serviceManager.deleteService(request.params.sid);
    response.status(service ? 200 : 404).json(service ?? { error: 'Servicio no encontrado.' });
  },
});
