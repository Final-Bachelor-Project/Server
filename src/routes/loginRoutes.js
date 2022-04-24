import express from 'express';
import config from 'config';

import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

const redirectUri = config.get(`redirectUri`);
const clientRedirectUri = config.get(`clientRedirectUri`);
const clientId = config.get(`clientId`);
const clientSecret = config.get(`clientSecret`)

router.get('/login', async (req, res) => {
    const scope =
    `user-modify-playback-state
    user-read-playback-state
    user-read-currently-playing
    user-library-modify
    user-library-read
    user-top-read
    playlist-read-private
    playlist-modify-public`;

    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri
    }));
});

router.get('/callback', async (req, res) => {
    const body = {
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }
    
      await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: encodeFormData(body)
      })
      .then(response => response.json())
      .then(data => {
        const query = querystring.stringify(data);
        res.redirect(`${clientRedirectUri}?${query}`);
      });

});

export default {
    router: serverErrorSafe(router)
}