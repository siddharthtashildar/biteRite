const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },

  name: String,
  email: String,

  dietType: String,
  healthConditions: [String],
  allergies: [String],

  age: Number,
  weight: Number,
  goal: String,

  onboardingCompleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);