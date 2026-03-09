const User = require("../models/User");

exports.updateProfile = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.saveRecipe = async (req, res) => {

  try {

    const { recipeId } = req.body;

    const user = await User.findById(req.user.id);

    user.savedRecipes.push(recipeId);

    await user.save();

    res.json({ message: "Recipe saved" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getSavedRecipes = async (req, res) => {

  try {

    const user = await User.findById(req.user.id)
      .populate("savedRecipes");

    res.json(user.savedRecipes);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};