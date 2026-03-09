const Recipe = require("../models/Recipe");
const filterRecipes = require("../utils/healthRules");

exports.getRecommendedRecipes = async (req, res) => {
  try {
    const { ingredients, conditions } = req.body;

    const recipes = await Recipe.find({
      ingredients: { $in: ingredients }
    });

    const filtered = filterRecipes(recipes, conditions);

    res.json(filtered);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};