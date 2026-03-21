const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed, continuing without DB");
    // Do NOT exit the process – the app can still run
  }
};

module.exports = connectDB;