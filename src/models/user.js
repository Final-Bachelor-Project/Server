import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  spotifyUserId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  connections: {
    type: [mongoose.ObjectId],
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  dataOfBirth: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
});

export default mongoose.model('User', userSchema);
