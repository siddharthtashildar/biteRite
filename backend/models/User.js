const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },

  name: String,
  email: String,

  role: {
    type: String,
    enum: ["user", "dietician"],
    default: "user"
  },

  dietType: String,
  healthConditions: [String],
  allergies: [String],

  age: Number,
  weight: Number,
  goal: String,

  onboardingCompleted: {
    type: Boolean,
    default: false
  },

  // 🔥 ADD THESE

  recipesGenerated: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }
  ],

  savedRecipes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }
  ],

  favorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }
  ]

}, { timestamps: true });


module.exports = mongoose.models.User || mongoose.model("User", userSchema);