/* eslint-disable no-underscore-dangle */
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
    dateOfBirth
  );

  if (user) {
    req.session.loggedInUser = user;
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

// Get all users
router.get('/', async (req, res) => {
  const { loggedInUser } = req.session;
  const users = await userService.getAllUsers(loggedInUser);
  if (users) {
    res.status(200).send(users);
    return;
  }
  res.status(404).send({ message: 'No users found' });
});

// Get user by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  if (user) {
    res.status(200).send(user);
    return;
  }
  res.status(404).send({ message: `No user found with the id ${id}` });
});

// Get current user connections
router.get('/current/connections', async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  if (!user) {
    res.status(404).send({ message: 'No user found' });
    return;
  }

  const { connections } = user;
  if (connections.length === 0) {
    res.status(404).send({ message: `No connections found for user with id ${user.id}` });
    return;
  }

  res.status(200).send(connections);
});

export default {
  router: serverErrorSafe(router)
};
