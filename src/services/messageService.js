import mongoose from 'mongoose';

import Message from '../models/message';

// Get all messages by chat id
const getMessagesByChatId = async (id, currentUserId) => {
  const oId1 = mongoose.Types.ObjectId(id);
  const oId2 = mongoose.Types.ObjectId(currentUserId);

  const messagesList = await Message.find({ chatId: oId1 });
  const messages = messagesList.map((message) => {
    let sentByLoggedInUser = false;

    if (message.sentBy.equals(oId2)) {
      sentByLoggedInUser = true;
    }

    return {
      sentByLoggedInUser,
      content: message.content,
      dateTime: message.dateTime
    };
  });

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
