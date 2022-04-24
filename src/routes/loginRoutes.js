import express from 'express';
import config from 'config';
import querystring from 'query-string';

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
  console.log('called');
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
  const body = {
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  };

  await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: encodeFormData(body)
  })
    .then((response) => response.json())
    .then((data) => {
      const query = querystring.stringify(data);
      res.redirect(`${clientRedirectUri}?${query}`);
    });
});

export default {
  router: serverErrorSafe(router)
};
