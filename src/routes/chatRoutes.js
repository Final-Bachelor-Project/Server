import express from 'express';
import { async } from 'regenerator-runtime';

import chatService from '../services/chatService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

// Get current user chats
router.get('/', async (req, res) => {
  const currentUser = req.session.loggedInUser;
  const chats = await chatService.getCurrentUserChats(currentUser);

  if (chats.length === 0) {
    res.status(404).send({ message: `No chats found for user with id ${currentUser.id}` });
    return;
  }

  res.status(200).send(chats);
});

// Get chat by user ids
router.get('/:id', async (req, res) => {
  const currentUser = req.session.loggedInUser;
  const { id } = req.params;

  const chat = await chatService.getChatByUsersIds(currentUser.id, id);
  if (!chat) {
    res.status(404).send({ message: 'No chat found for users' });
    return;
  }

  res.status(200).send(chat);
});

export default {
  router: serverErrorSafe(router)
};
