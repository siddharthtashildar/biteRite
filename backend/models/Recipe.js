const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({

  title: String,

  image: String, 

  ingredients: [String],

  instructions: [String], 

  cookingTime: Number,

  dietType: {
    type: String,
    enum: ["veg", "non-veg", "vegan"],
    default: "veg"
  },

  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },

  healthTags: [String],

  createdBy: String,
  // Verification fields
  pendingVerification: {
    type: Boolean,
    default: false
  },

  verifiedByDietician: {
    type: Boolean,
    default: false
  },

  dieticianVerifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  verificationDate: {
    type: Date,
  },

  isUserCreated: {
    type: Boolean,
    default: false
  },

  rejectionReason: {
    type: String,
    default: null
  },

  dieticianRejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  rejectionDate: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Recipe", RecipeSchema);