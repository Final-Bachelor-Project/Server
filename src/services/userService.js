/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import mongoose from 'mongoose';

import User from '../models/user';
import requestService from './requestService';
import helperFunctions from '../utils/helperFunctions';

// Create user
// eslint-disable-next-line max-len
const createUser = async (spotifyUserId, username, firstName, lastName, profileImage, country, city, bio, dateOfBirth, tracks, artists) => {
  const user = await new User({
    spotifyUserId,
    username,
    firstName,
    lastName,
    profileImage,
    country,
    city,
    bio,
    dateOfBirth,
    connections: [],
    createdAt: Date.now(),
    tracks,
    artists
  }).save();

  return user;
};

// Get logged in user
const getCurrentUser = async (accessToken) => {
  const user = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return user;
};

// Get user by spotify id
const getUserBySpotifyUserId = async (spotifyUserId) => {
  const user = await User.findOne({ spotifyUserId });
  return user;
};

// Get user spotify profile
// eslint-disable-next-line no-unused-vars
const getUserProfile = async (spotifyUserId, accessToken) => {
  const user = await axios.get(`https://api.spotify.com/v1/users/${spotifyUserId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return user.data;
};

// Get user by id
const getUserById = async (id) => {
  const oId = mongoose.Types.ObjectId(id);
  const user = await User.findById({ _id: oId });
  return user;
};

// Get user tracks
const getListOfTracks = (user) => {
  const { tracks } = user;
  const tracksList = tracks.map((track) => track.id);
  return tracksList;
};

// Get user artists
const getListOfArtists = (user) => {
  const { artists } = user;
  const artistsList = artists.map((artist) => artist.id);
  return artistsList;
};

// Get all registered users except the logged in one
const getAllUsers = async (loggedInUser) => {
  const oId = mongoose.Types.ObjectId(loggedInUser._id);

  const users = await User.find({ _id: { $ne: oId } });
  const currentUser = await getUserById(loggedInUser._id);

  const usersList = [];
  if (users.length > 0) {
    await Promise.all(
      users.map(async (user) => {
        if (!await requestService.checkIfUserHasRequests(user._id, loggedInUser._id)) {
          let tracksScore,
            artistsScore = 0;
          if (user.tracks && currentUser.tracks) {
            const currentUserTracks = getListOfTracks(currentUser);
            const userTracks = getListOfTracks(user);
            tracksScore = helperFunctions.comepareArrays(currentUserTracks, userTracks);
          }

          if (user.artists && currentUser.artists) {
            const currentUserArtists = getListOfArtists(currentUser);
            const userArtists = getListOfArtists(user);
            artistsScore = helperFunctions.comepareArrays(currentUserArtists, userArtists);
          }

          const score = helperFunctions.caculateAverageScore(tracksScore, artistsScore);
          // eslint-disable-next-line no-param-reassign
          usersList.push({
            _id: user.id,
            username: user.username,
            profileImage: user.profileImage,
            score
          });
        }
      })
    );
  }

  if (usersList.length === 0) {
    return null;
  }

  return usersList.sort((a, b) => b.score - a.score);
};

// Create connection between users
const createConnection = async (firstUserId, secondUserId) => {
  const firstUserOId = mongoose.Types.ObjectId(firstUserId);
  const secondUserOId = mongoose.Types.ObjectId(secondUserId);

  await User.updateOne({ _id: firstUserOId }, { $push: { connections: secondUserOId } });
  await User.updateOne({ _id: secondUserOId }, { $push: { connections: firstUserOId } });
};

// Remove connection between users
const removeConnection = async (firstUserId, secondUserId) => {
  const firstUserOId = mongoose.Types.ObjectId(firstUserId);
  const secondUserOId = mongoose.Types.ObjectId(secondUserId);

  await User.updateOne({ _id: firstUserOId }, { $pullAll: { connections: secondUserOId } });
  await User.updateOne({ _id: secondUserOId }, { $pullAll: { connections: firstUserOId } });
};

// Get user connections
const getUserConnections = async (connectionsIds) => {
  const connections = await Promise.all(connectionsIds.map(async (connectionId) => {
    const foundUser = await getUserById(connectionId);
    return foundUser;
  }));

  return connections;
};

// Get current user top tracks data from spotify
const getUserSpotifyTracks = async (accessToken) => {
  const tracks = await axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (tracks.data.items.length === 0) {
    return [];
  }

  const topTracks = tracks.data.items.map((track) => {
    const artists = track.artists.map((artist) => artist.name);
    return {
      name: track.name,
      artists,
      id: track.id,
      image: track.album.images[0].url
    };
  });

  return topTracks;
};

// Save user top tracks
const saveUserTopTracks = async (accessToken, id) => {
  const oId = mongoose.Types.ObjectId(id);
  const tracks = await getUserSpotifyTracks(accessToken);
  await User.updateOne({ _id: oId }, { tracks });
};

// Get user spotify artists data
const getUserSpotifyArtists = async (accessToken) => {
  const artists = await axios.get('https://api.spotify.com/v1/me/top/artists', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (artists.data.items.length === 0) {
    return [];
  }

  const topArtists = artists.data.items.map((artist) => ({
    name: artist.name,
    genres: artist.genres,
    id: artist.id,
    image: artist.images[0].url
  }));

  return topArtists;
};

// Save user top artists
const saveUserTopArtists = async (accessToken, id) => {
  const oId = mongoose.Types.ObjectId(id);
  const artists = await getUserSpotifyArtists(accessToken);
  await User.updateOne({ _id: oId }, { artists });
};

export default {
  createUser,
  getCurrentUser,
  getUserBySpotifyUserId,
  getAllUsers,
  getUserById,
  createConnection,
  removeConnection,
  getUserConnections,
  saveUserTopTracks,
  getUserSpotifyTracks,
  saveUserTopArtists,
  getUserSpotifyArtists
};
