import axios from 'axios';
import mongoose from 'mongoose';

import User from '../models/user';

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
  // eslint-disable-next-line no-underscore-dangle
  const oId = mongoose.Types.ObjectId(loggedInUser._id);
  const users = await User.find({ _id: { $ne: oId } });

  if (users.length === 0) {
    return null;
  }
  return users;
};

// Get user by id
const getUserById = async (id) => {
  const oId = mongoose.Types.ObjectId(id);
  const user = await User.findById({ _id: oId });

  return user;
};

export default {
  createUser,
  getCurrentUser,
  getUserBySpotifyUserId,
  getAllUsers,
  getUserById
};
