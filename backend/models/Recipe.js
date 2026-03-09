const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({

  title: String,

  ingredients: [String],

  steps: [String],

  cookingTime: Number,

  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    sugar: Number,
    sodium: Number
  },

  healthTags: [String],

  verifiedByDietitian: {
    type: Boolean,
    default: false
  }

});

module.exports = mongoose.model("Recipe", RecipeSchema);