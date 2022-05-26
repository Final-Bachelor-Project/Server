/* eslint-disable no-underscore-dangle */
// import { Server } from 'socket.io';
import mongoose from 'mongoose';

import Chat from '../models/chat';

// let io;
// const connect = async (server) => {
//   io = new Server(server);
// };

// Get current user all chats
const getCurrentUserChats = async (user) => {
  const oId = mongoose.Types.ObjectId(user._id);
  const chats = await Chat.find({ participants: { $in: [oId] } });

  return chats;
};

// Get chat by users id
const getChatByUsersIds = async (userId1, userId2) => {
  const oId1 = mongoose.Types.ObjectId(userId1);
  const oId2 = mongoose.Types.ObjectId(userId2);

  const chat = await Chat.find({ participants: { $in: [oId1, oId2] } });

  return chat;
};

// Get chat by user id

// Create chat
const createChat = async (userId1, userId2) => {
  const oId1 = mongoose.Types.ObjectId(userId1);
  const oId2 = mongoose.Types.ObjectId(userId2);
  const participants = [oId1, oId2];

  const chat = await new Chat({
    participants,
    createdAt: Date.now()
  }).save();

  return chat;
};

// Delete chat

export default {
  // connect,
  getCurrentUserChats,
  getChatByUsersIds,
  createChat
};
