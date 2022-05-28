import mongoose from 'mongoose';

import Message from '../models/message';

// Get all messages by chat id
const getMessagesByChatId = async (id) => {
  const oId1 = mongoose.Types.ObjectId(id);
  const messages = await Message.find({ chatId: oId1 });
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

export default {
  getMessagesByChatId,
  createMessage
};
