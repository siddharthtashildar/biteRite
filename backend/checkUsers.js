require("dotenv").config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}, 'clerkId name email role');
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`ID: ${user.clerkId}, Name: ${user.name}, Role: ${user.role}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkUsers();