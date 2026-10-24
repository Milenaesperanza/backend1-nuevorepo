export const createBookingsController = (bookingsService) => ({
  createBooking(request, response) {
    response.status(201).json(bookingsService.createBooking(request.body));
  },

  getBookingById(request, response) {
    const booking = bookingsService.getBookingById(request.params.bid);
    response.status(booking ? 200 : 404).json(booking ?? { error: 'Reserva no encontrada.' });
  },

  addServiceToBooking(request, response) {
    const { bid, sid } = request.params;

    const booking = bookingsService.addServiceToBooking(bid, sid);
    response.status(booking ? 200 : 404).json(
      booking ?? { error: 'La reserva o el servicio no existe.' }
    );
  },
});
