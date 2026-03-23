const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({

  title: String,

  image: String, // 🔥 needed

  ingredients: [String],

  instructions: [String], // 🔥 needed

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

  createdBy: String, // 🔥 needed for user mapping

  verifiedByDietitian: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Recipe", RecipeSchema);