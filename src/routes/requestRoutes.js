/* eslint-disable no-underscore-dangle */
import express from 'express';

import requestService from '../services/requestService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

// Create request
router.post('/', async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.session.loggedInUser._id;
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

// Get current user pending requests
router.get('/', async (req, res) => {
  const loggedInUserId = req.session.loggedInUser._id;
  const requests = await requestService.getUserPendingRequests(loggedInUserId);

  if (requests) {
    res.status(200).send(requests);
    return;
  }
  res.status(404).send({ message: 'No pending requests found' });
});

// Check if pending requests between users
router.get('/users/:id', async (req, res) => {
  const loggedInUserId = req.session.loggedInUser._id;
  const { id } = req.params;

  const check = await requestService.checkIfPendingRequestBetweenUsers(loggedInUserId, id);

  res.status(200).send(check);
});

export default {
  router: serverErrorSafe(router)
};
