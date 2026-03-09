const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "dietitian", "admin"],
    default: "user"
  },

  age: Number,
  height: Number,
  weight: Number,

  dietaryPreferences: [String],
  healthConditions: [String],

  savedRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe"
    }
  ]

});

module.exports = mongoose.model("User", UserSchema);