import config from 'config';
import mongoose from 'mongoose';

const connect = async () => {
  const uri = config.get('connection');

  try {
    await mongoose.connect(uri);
  }
  catch (error) {
    console.log(error);
  }
};

export default {
  connect
};
