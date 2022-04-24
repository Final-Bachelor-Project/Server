import express from 'express';
import config from 'config';
import querystring from 'query-string';
import axios from 'axios';

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
  const code = req.query.code;

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
      Authorization: `Basic ${new Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
  })

  const { access_token, token_type } = response.data;

  console.log(access_token)

//   const query = querystring.stringify(response.data, null, 2)
//   console.log(query);
//   res.redirect(`${clientRedirectUri}?${query}`)
 
  //console.log(JSON.stringify(response.data, null, 2))
//   await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Accept: 'application/json'
//     },
//     body: encodeFormData(body)
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       const query = querystring.stringify(data);
//       res.redirect(`${clientRedirectUri}?${query}`);
//     });
});

export default {
  router: serverErrorSafe(router)
};
