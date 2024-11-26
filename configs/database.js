const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB Database! 🎉');
  } catch (error) {
    console.error('MongoDB Connection Error 😥', error);
    process.exit(1);
  }
};

module.exports = connectDB;