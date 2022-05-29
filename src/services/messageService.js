import mongoose from 'mongoose';

import Message from '../models/message';

// Get all messages by chat id
const getMessagesByChatId = async (id) => {
  const oId1 = mongoose.Types.ObjectId(id);
  const messages = await Message.find({ chatId: oId1 }).sort({ dateTime: 1 });
  return messages;
};

// Create message
const createMessage = async (sentBy, content, chatId) => {
  const oId1 = mongoose.Types.ObjectId(sentBy);
  const oId2 = mongoose.Types.ObjectId(chatId);

  const message = await new Message({
    dateTime: Date.now(),
    sentBy: oId1,
    content,
    chatId: oId2
  }).save();

  return message;
};

// Get chat last message
const getChatLastMessage = async (id) => {
  const oId = mongoose.Types.ObjectId(id);
  const messages = await Message.find({ chatId: oId }).sort({ dateTime: -1 });
  return messages[0];
};

// Delete messages by chat id
const removeMessagesByChatId = async (id) => {
  const oId = mongoose.Types.ObjectId(id);
  await Message.remove({ chatId: oId });
};

export default {
  getMessagesByChatId,
  createMessage,
  getChatLastMessage,
  removeMessagesByChatId
};
