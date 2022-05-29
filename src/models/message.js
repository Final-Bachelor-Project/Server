import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  dateTime: {
    type: Number,
    required: true
  },
  sentBy: {
    type: mongoose.ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  chatId: {
    type: mongoose.ObjectId,
    required: true
  }
});

export default mongoose.model('Message', messageSchema);
