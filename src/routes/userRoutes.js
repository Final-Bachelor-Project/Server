import express from 'express';
import axios from 'axios';
import config from 'config';

import userService from '../services/userService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

// Create user
router.post('/', async (req, res) => {
  const user = await userService.createUser();

  res.status(200).send(user);
});

// Get user data from Spotify API
router.get('/user', async (req, res) => {
  const { accessToken } = req.session;
  const clientRedirectUri = config.get('clientRedirectUri');

  if (accessToken) {
    const user = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    res.send({
      user: user.data
    });
  }
});

export default {
  router: serverErrorSafe(router)
};
