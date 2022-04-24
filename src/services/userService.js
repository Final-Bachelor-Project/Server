import User from '../models/user';

const createUser = async () => {
   const user = await new User({
       spotifyUserId: "1234567",
       email: "user@email.com",
       name: "username",
       coonection: [],
       profileImage: "https:kslwaæ",
       country: "Denmark",
       city: "Copenhagen",
       bio: "Description",
       createdAt: Date.now()
   }).save();

   return user;
}

export default {
    createUser: createUser
}