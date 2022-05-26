import express from 'express';

import chatService from '../services/chatService';

const router = express.Router();

router.get('/chats', async (req, res) => {
  const currentUser = req.session.loggedInUser;
  const chats = await chatService.getCurrentUserChats(currentUser);

  if (chats.length === 0) {
    res.status(404).send({ message: `No chats found for user with id ${currentUser.id}` });
    return;
  }

  res.status(200).send(chats);
});

export default {

};
