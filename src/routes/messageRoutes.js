/* eslint-disable no-underscore-dangle */
import express from 'express';

import messageService from '../services/messageService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

// Get messages by chat id
router.get('/chat/:id', async (req, res) => {
  const currentUser = req.session.loggedInUser;
  const { id } = req.params;

  const messages = await messageService.getMessagesByChatId(id, currentUser._id);
  res.status(200).send(messages);
});

export default {
  router: serverErrorSafe(router)
};
