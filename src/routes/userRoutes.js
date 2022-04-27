import express from 'express';
import axios from 'axios';

import userService from '../services/userService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

// Create user
router.post('/', async (req, res) => {
  const {
    spotifyUserId, username, firstName, lastName, profileImage, country, city, bio, dateOfBirth
  } = req.body;

  const user = await userService.createUser(
    spotifyUserId,
    username,
    firstName,
    lastName,
    profileImage,
    country,
    city,
    bio,
    dateOfBirth,
    { createdAt: Date.now() }
  );

  if (user) {
    res.status(200).send({ message: 'Successfully created user' });
    return;
  }
  res.status(500).send({ message: 'Could not create user' });
});

// Get user data from Spotify API
router.get('/current', async (req, res) => {
  const accessToken = req.session;
  const user = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (user) {
    res.status(200).send({ user: user.data });
    return;
  }
  res.status(404).send({ message: 'User not found' });
});

export default {
  router: serverErrorSafe(router)
};
