import express from 'express';
import axios from 'axios';

import userService from '../services/userService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

// Create user
router.post('/', async (req, res) => {
  const {
    username, firstName, lastName, profileImage, country, city, bio
  } = req.body;

  const user = await userService.createUser(
    username,
    firstName,
    lastName,
    profileImage,
    country,
    city,
    bio,
    { createdAt: Date.now() }
  );

  console.log(user);

  res.status(200).send(user);
});

// Get user data from Spotify API
router.get('/current', async (req, res) => {
  const { accessToken } = req.session;

  if (accessToken) {
    const user = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    res.status(200).send({ user: user.data });
  }
});

export default {
  router: serverErrorSafe(router)
};
