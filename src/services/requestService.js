/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
import mongoose from 'mongoose';

import Request from '../models/request';
import userService from './userService';

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

    if (status === 'accepted') {
      await userService.createConnection(request.senderId, request.receiverId);
    }
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

  const requestsWithUser = await Promise.all(requests.map(async (request) => {
    const { senderId } = request;
    const user = await userService.getUserById(senderId);

    return {
      request,
      user
    };
  }));

  return requestsWithUser;
};

// Check if user has requests
const checkIfUserHasRequests = async (userId, loggedInUserId) => {
  const requests = await Request.find({
    $or: [{
      $and: [{ senderId: userId }, { receiverId: loggedInUserId }]
    },
    { $and: [{ senderId: loggedInUserId }, { receiverId: userId }] }
    ]
  });

  if (requests.length > 0) {
    return true;
  }
  return false;
};

// Check for pending requests between users
const checkIfPendingRequestBetweenUsers = async (loggedInUserId, id) => {
  const oId1 = mongoose.Types.ObjectId(loggedInUserId);
  const oId2 = mongoose.Types.ObjectId(id);

  const requests = await Request.find({
    $or: [{
      $and: [{ senderId: oId1 }, { receiverId: oId2 }, { status: 'pending' }]
    },
    { $and: [{ senderId: oId2 }, { receiverId: oId1 }, { status: 'pending' }] }
    ]
  });

  if (requests.length === 0) {
    return false;
  }

  return true;
};

// Remove request between users
const removeRequestBetweenUsers = async (loggedInUserId, id) => {
  const oId1 = mongoose.Types.ObjectId(loggedInUserId);
  const oId2 = mongoose.Types.ObjectId(id);

  const requests = await Request.find({
    $or: [{
      $and: [{ senderId: oId1 }, { receiverId: oId2 }]
    },
    { $and: [{ senderId: oId2 }, { receiverId: oId1 }] }
    ]
  });

  if (requests.length > 0) {
    const odI3 = mongoose.Types.ObjectId(requests[0]._id);
    await Request.deleteMany({ _id: odI3 });
  }
};

export default {
  createRequest,
  confirmOrDeclineRequest,
  getUserPendingRequests,
  checkIfUserHasRequests,
  checkIfPendingRequestBetweenUsers,
  removeRequestBetweenUsers
};
