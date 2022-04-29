import express from 'express';
import axios from 'axios';

import userService from '../services/userService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

// Create user
router.post('/', async (req, res) => {
  const user = await userService.createUser(req.body);

  if (user) {
    res.status(200).send({ message: 'Successfully created user' });
    return;
  }
  res.status(500).send({ message: 'Could not create user' });
});

// Get current user data from Spotify API
router.get('/current', async (req, res) => {
  const { accessToken } = req.session;
  const user = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (user) {
    res.status(200).send({ user: user.data });
    return;
  }
  res.status(404).send({ message: 'User not found' });
});

// Get users Spotify profiles
router.get('/', async (req, res) => {
  const users = await userService.getAllUsers();
  if (users) {
    res.status(200).send(users);
    return;
  }
  res.status(404).send('No users found');
});

// // Get user by id
// router.get('/:id', async (req, res) => {
//   const id =
//   const user = await userService.getUserById()

// });

export default {
  router: serverErrorSafe(router)
};
