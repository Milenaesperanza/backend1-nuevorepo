import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const MessageModel = mongoose.model('Message', messageSchema);
