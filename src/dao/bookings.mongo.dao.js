import { BookingModel } from '../models/booking.model.js';

const toPlainBooking = (booking) => booking?.toObject?.() ?? booking;

export class BookingsMongoDao {
  async create(booking) {
    const createdBooking = await BookingModel.create(booking);
    return toPlainBooking(createdBooking);
  }

  async getById(id) {
    return BookingModel.findOne({ id }).lean();
  }

  async update(id, booking) {
    return BookingModel.findOneAndUpdate({ id }, booking, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();
  }

  async getAll() {
    return BookingModel.find().lean();
  }
}
