import axios from 'axios';
import mongoose from 'mongoose';

import User from '../models/user';

const createUser = async (userData) => {
  const user = await new User({
    spotifyUserId: userData.spotifyUserId,
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    profileImage: userData.profileImage,
    country: userData.country,
    city: userData.city,
    bio: userData.bio,
    dateOfBirth: userData.dateOfBirth,
    connections: [],
    createdAt: Date.now()
  }).save();

  return user;
};

const getCurrentUser = async (accessToken) => {
  const user = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return user;
};

const getUserBySpotifyUserId = async (spotifyUserId) => {
  const user = await User.findOne({ spotifyUserId });
  return user;
};

// eslint-disable-next-line no-unused-vars
const getUserProfile = async (spotifyUserId, accessToken) => {
  const user = await axios.get(`https://api.spotify.com/v1/users/${spotifyUserId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return user.data;
};

const getAllUsers = async () => {
  const users = await User.find();
  if (users.length === 0) {
    return null;
  }
  return users;
};

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
