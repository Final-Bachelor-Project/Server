import axios from 'axios';

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

const getUserProfile = async (spotifyUserId, accessToken) => {
  const user = await axios.get(`https://api.spotify.com/v1/users/${spotifyUserId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return user.data;
};

const getAllUsers = async (accessToken) => {
  const users = await User.find();
  if (users.length === 0) {
    return null;
  }

  const usersProfile = await Promise.all(users.map(async (user) => {
    const profile = await getUserProfile(user.spotifyUserId, accessToken);
    return profile;
  }));

  return usersProfile;
};

export default {
  createUser,
  getCurrentUser,
  getUserBySpotifyUserId,
  getAllUsers
};
