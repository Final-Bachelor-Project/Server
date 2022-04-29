import express from 'express';

import requestService from '../services/requestService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

// Create request
router.post('/', async (req, res) => {
  const { receiverId } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const { senderId } = req.session.loggedInUser._id;
  const request = await requestService.createRequest(senderId, receiverId);

  if (request) {
    res.status(200).send({ message: 'Successfully created request' });
    return;
  }
  res.status(500).send({ message: 'Could not create request' });
});

// Confirm or decline request
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const request = await requestService.confirmOrDeclineRequest(id, status);
  if (request) {
    res.status(200).send({ message: 'Succesfully updated request' });
    return;
  }
  res.status(409).send({ message: 'Wrong status' });
});

export default {
  router: serverErrorSafe(router)
};
