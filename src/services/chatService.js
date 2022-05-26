import { Server } from 'socket.io';
import mongoose from 'mongoose';

import Chat from '../models/chat';

let io;
const connect = async (server) => {
  io = new Server(server);
};

// Get current user all chats
const getCurrentUserChats = async (user) => {
  const oId = mongoose.Types.ObjectId(user.id);
  const chats = await Chat.find({ participants: { $in: [oId] } });

  return chats;
};

// Get chat by users id

// Get chat by user id

// Create chat

// Delete chat

export default {
  connect,
  getCurrentUserChats
};
