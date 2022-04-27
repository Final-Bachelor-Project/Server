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

export default {
  createUser
};
