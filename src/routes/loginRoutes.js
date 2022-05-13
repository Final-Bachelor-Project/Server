/* eslint-disable no-underscore-dangle */
import express from 'express';
import config from 'config';
import querystring from 'query-string';
import axios from 'axios';

import userService from '../services/userService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

const redirectUri = config.get('redirectUri');
const clientRedirectUri = config.get('clientRedirectUri');
const clientId = config.get('clientId');
const clientSecret = config.get('clientSecret');

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

router.get('/test', (req, res) => {
  res.status(200).send(req.session.accessToken);
});

router.get('/', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  res.header('Access-Control-Allow-Origin');

  const scope = `user-modify-playback-state
    user-read-playback-state
    user-read-currently-playing
    user-library-modify
    user-library-read
    user-top-read
    playlist-read-private
    playlist-modify-public`;

  res.redirect(`http://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope,
      state,
      redirect_uri: redirectUri
    })}`);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;

  const response = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // eslint-disable-next-line new-cap
      Authorization: `Basic ${new Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    }
  });

  if (response.data.access_token) {
    req.session.accessToken = response.data.access_token;
  }

  req.session.accessToken = 'access token';

  const currentSpotifyUser = await userService.getCurrentUser(req.session.accessToken);
  if (!currentSpotifyUser) {
    res.status(404).send({ message: 'User not found' });
    return;
  }

  const existingUser = await userService.getUserBySpotifyUserId(currentSpotifyUser.data.id);
  if (existingUser) {
    req.session.loggedInUser = existingUser;

    await userService.saveUserTopTracks(req.session.accessToken, existingUser._id);
    await userService.saveUserTopArtists(req.session.accessToken, existingUser._id);

    res.redirect(`${clientRedirectUri}/explore`);
    return;
  }
  res.redirect(`${clientRedirectUri}/complete`);
});

// Postman session
router.get('/session', async (req, res) => {
  const currentSpotifyUser = await userService.getCurrentUser(req.headers.session);
  if (!currentSpotifyUser) {
    res.status(404).send({ message: 'User not found' });
    return;
  }

  const existingUser = await userService.getUserBySpotifyUserId(currentSpotifyUser.data.id);
  if (existingUser) {
    req.session.loggedInUser = existingUser;
    res.status(200).send({ message: 'Successfully set up logged in user' });
    return;
  }
  res.status(200).send({ message: 'Successfully set up logged in user' });
});

export default {
  router: serverErrorSafe(router),
  generateRandomString
};
