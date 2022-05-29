import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
  participants: {
    type: [mongoose.ObjectId],
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
});

export default mongoose.model('Chat', chatSchema);
