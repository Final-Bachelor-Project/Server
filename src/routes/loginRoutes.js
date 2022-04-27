import express from 'express';
import config from 'config';
import querystring from 'query-string';
import axios from 'axios';

import session from 'express-session';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

const redirectUri = config.get('redirectUri');
const clientRedirectUri = config.get('clientRedirectUri');
const clientId = config.get('clientId');
const clientSecret = config.get('clientSecret');

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

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
      Authorization: `Basic ${new Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    }
  });

  if (response.data.access_token) {
    req.session.accessToken = response.data.access_token;
  }

  res.redirect(clientRedirectUri);
});

export default {
  router: serverErrorSafe(router)
};
