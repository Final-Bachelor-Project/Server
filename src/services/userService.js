/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import mongoose from 'mongoose';

import User from '../models/user';
import requestService from './requestService';

// Create user
// eslint-disable-next-line max-len
const createUser = async (spotifyUserId, username, firstName, lastName, profileImage, country, city, bio, dateOfBirth) => {
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
    createdAt: Date.now()
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

// Get all registered users except the logged in one
const getAllUsers = async (loggedInUser) => {
  const oId = mongoose.Types.ObjectId(loggedInUser._id);
  const users = await User.find({ _id: { $ne: oId } });

  const usersList = [];
  if (users.length > 0) {
    await Promise.all(
      users.map(async (user) => {
        if (!await requestService.checkIfUserHasRequests(user._id, loggedInUser._id)) {
          usersList.push(user);
        }
      })
    );
  }

  if (usersList.length === 0) {
    return null;
  }
  return usersList;
};

// Get user by id
const getUserById = async (id) => {
  const oId = mongoose.Types.ObjectId(id);
  const user = await User.findById({ _id: oId });

  return user;
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
  const tracks = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (tracks.data.items.length === 0) {
    return null;
  }

  const topTracks = tracks.data.itemas.map(async (track) => {
    const artists = track.artists.map((artist) => artist.name);
    return {
      name: track.name,
      artists,
      id: track.id
    };
  });

  return topTracks;
};

// Save user top tracks
const saveUserTopTracks = async (accessToken, id) => {
  const oId = mongoose.Types.ObjectId(id);
  const tracks = await getUserSpotifyTracks(accessToken, id);
  await User.updateOne({ _id: oId }, { tracks });
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
  getUserSpotifyTracks
};
