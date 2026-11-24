export const createViewsController = (servicesService, bookingsService) => ({
  async renderHome(request, response) {
    const services = await servicesService.getServices();
    response.render('home', { title: 'Inicio', services });
  },

  async renderRealtimeProducts(request, response) {
    const services = await servicesService.getServices();
    response.render('realtimeproducts', { title: 'Servicios en tiempo real', services });
  },

  async renderServices(request, response) {
    const services = await servicesService.getServices();
    response.render('services', { title: 'Servicios', services });
  },

  async renderAvailability(request, response) {
    const services = await servicesService.getServices();
    response.render('availability', { title: 'Disponibilidad', services });
  },

  async renderBookings(request, response) {
    const bookings = await bookingsService.getBookings();
    response.render('bookings', { title: 'Reservas', bookings });
  },
});
