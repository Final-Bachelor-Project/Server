import mongoose from 'mongoose';

import Request from '../models/request';

// Create request
const createRequest = async (senderId, receiverId) => {
  const request = await new Request({
    senderId,
    receiverId,
    status: 'pending',
    createdAt: Date.now()
  }).save();

  return request;
};

// Confirm/decline request
const confirmOrDeclineRequest = async (id, status) => {
  const oId = mongoose.Types.ObjectId(id);

  if (status === 'accepted' || status === 'rejected') {
    const request = await Request.findOneAndUpdate({ _id: oId }, { status });
    return request;
  }
  return null;
};

// Get user pending requests
const getUserPendingRequests = async (loggedInUserId) => {
  const oId = mongoose.Types.ObjectId(loggedInUserId);

  const requests = await Request.find({ receiverId: oId, status: 'pending' });
  if (requests.length === 0) {
    return null;
  }
  return requests;
};

export default {
  createRequest,
  confirmOrDeclineRequest,
  getUserPendingRequests
};
