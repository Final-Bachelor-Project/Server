import mongoose from 'mongoose';

const requestSchema = mongoose.Schema({
  senderId: {
    type: mongoose.ObjectId,
    required: true
  },
  receiverId: {
    type: mongoose.ObjectId,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }

});

export default mongoose.model('Request', requestSchema);
