export const createBookingsController = (bookingManager, serviceManager) => ({
  createBooking(request, response) {
    response.status(201).json(bookingManager.createBooking(request.body));
  },

  getBookingById(request, response) {
    const booking = bookingManager.getBookingById(request.params.bid);
    response.status(booking ? 200 : 404).json(booking ?? { error: 'Reserva no encontrada.' });
  },

  addServiceToBooking(request, response) {
    const { bid, sid } = request.params;

    if (!serviceManager.getServiceById(sid)) {
      response.status(404).json({ error: 'La reserva o el servicio no existe.' });
      return;
    }

    const booking = bookingManager.addServiceToBooking(bid, sid);
    response.status(booking ? 200 : 404).json(
      booking ?? { error: 'La reserva o el servicio no existe.' }
    );
  },
});
