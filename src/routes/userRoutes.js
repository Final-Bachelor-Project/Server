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
  const { accessToken } = req.session;

  const tracks = await userService.getUserSpotifyTracks(accessToken);
  const artists = await userService.getUserSpotifyArtists(accessToken);
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
    tracks,
    artists
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
  const loggedInUserId = req.session.loggedInUser._id;
  const user = await userService.getUserById(loggedInUserId);

  if (!user) {
    res.status(404).send({ message: 'No user found' });
    return;
  }

  const { connections } = user;
  if (connections.length === 0) {
    res.status(404).send({ message: `No connections found for user with id ${user.id}` });
    return;
  }

  const connectionsList = await userService.getUserConnections(connections);
  res.status(200).send(connectionsList);
});

// Delete connection between users
router.delete('/current/connections/:id', async (req, res) => {
  const connectionId = req.params.id;
  const loggedInUserId = req.session.loggedInUser._id;

  await userService.removeConnection(loggedInUserId, connectionId);

  res.status(200).send({ message: 'Connection removed' });
});

// Get current user top tracks
router.get('/current/tracks', async (req, res) => {
  const { accessToken } = req.session;
  const tracks = await userService.getTopTracks(accessToken);

  res.status(200).send(tracks);
});

// Get users common tracks
router.get('/tracks/:id/common', async (req, res) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);
  const tracks = await userService.getUsersCommonTracks(req.loggedInUser, user);

  res.status(200).send(tracks);
});

export default {
  router: serverErrorSafe(router)
};
