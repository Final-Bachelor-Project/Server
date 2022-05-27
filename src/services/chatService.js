/* eslint-disable no-underscore-dangle */
import socketIo from 'socket.io';
import mongoose from 'mongoose';
import config from 'config';

import { async } from 'regenerator-runtime';
import Chat from '../models/chat';
import userService from './userService';
import messageService from './messageService';

let io;
const connect = async (server) => {
  io = socketIo(server, {
    cors: true,
    origins: [config.get('clientUri')]
  });
};

// Socket connections
const socketConnection = async () => {
  io.sockets.on('connection', (socket) => {
    console.log('Socket connected');

    socket.on('disconnect', async () => {
      console.log('User disconnected');
    });

    socket.on('user-joined', (data) => {
      socket.join(data.chatId, async () => {
        console.log(data.chatId, 'Chat joined');
      });
    });

    // socket.on('messages', async (data) => {
    //   const { sentBy, content, chatId } = data;
    //   await messageService.createMessage(sentBy, content, chatId);
    // });
  });
};

// Get current user all chats
const getCurrentUserChats = async (currentUser) => {
  const oId = mongoose.Types.ObjectId(currentUser._id);
  const chats = await Chat.find({ participants: { $in: [oId] } });

  const finalResult = await Promise.all(chats.map(async (chat) => {
    const participants = chat.participants.filter((participant) => !participant.equals(oId));
    const user = await userService.getUserById(participants[0]);
    return {
      id: chat._id,
      user
    };
  }));

  return finalResult;
};

// Get chat by users id
const getChatByUsersIds = async (userId1, userId2) => {
  const oId1 = mongoose.Types.ObjectId(userId1);
  const oId2 = mongoose.Types.ObjectId(userId2);

  const chats = await Chat.find({ participants: { $in: [oId1, oId2] } });
  if (chats.length === 0) {
    return null;
  }

  return {
    chat: chats[0],
    new: false
  };
};

// Create chat
const createChat = async (userId1, userId2) => {
  const oId1 = mongoose.Types.ObjectId(userId1);
  const oId2 = mongoose.Types.ObjectId(userId2);
  const participants = [oId1, oId2];

  const chat = await new Chat({
    participants,
    createdAt: Date.now()
  }).save();

  return {
    chat,
    new: true
  };
};

// Get chat by id
const getChatById = async (id, currentUserId) => {
  const oId1 = mongoose.Types.ObjectId(id);
  const oId2 = mongoose.Types.ObjectId(currentUserId);

  const chat = await Chat.findById({ _id: oId1 });
  const participants = chat.participants.filter((participant) => !participant.equals(oId2));
  const user = await userService.getUserById(participants[0]);

  return {
    id: chat._id,
    user
  };
};

// Delete chat

export default {
  getCurrentUserChats,
  getChatByUsersIds,
  createChat,
  getChatById,
  connect,
  socketConnection
};
