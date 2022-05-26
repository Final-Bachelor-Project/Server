/* eslint-disable no-underscore-dangle */
import express from 'express';

import chatService from '../services/chatService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

// Get current user chats
router.get('/', async (req, res) => {
  const currentUser = req.session.loggedInUser;
  const chats = await chatService.getCurrentUserChats(currentUser);

  if (chats.length === 0) {
    res.status(404).send({ message: `No chats found for user with id ${currentUser._id}` });
    return;
  }

  res.status(200).send(chats);
});

// Get chat by users ids
router.get('/:id', async (req, res) => {
  const currentUser = req.session.loggedInUser;
  const { id } = req.params;

  let chat = await chatService.getChatByUsersIds(currentUser._id, id);
  if (!chat) {
    chat = await chatService.createChat(currentUser._id, id);
  }

  res.status(200).send(chat);
});

export default {
  router: serverErrorSafe(router)
};
