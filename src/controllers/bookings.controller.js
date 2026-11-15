export const createBookingsController = (bookingsService) => ({
  async createBooking(request, response) {
    response.status(201).json(await bookingsService.createBooking(request.body));
  },

  async getBookingById(request, response) {
    const booking = await bookingsService.getBookingById(request.params.bid);
    response.status(booking ? 200 : 404).json(booking ?? { error: 'Reserva no encontrada.' });
  },

  async addServiceToBooking(request, response) {
    const { bid, sid } = request.params;

    const booking = await bookingsService.addServiceToBooking(bid, sid);
    response.status(booking ? 200 : 404).json(
      booking ?? { error: 'La reserva o el servicio no existe.' }
    );
  },
});
