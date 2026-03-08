const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

router.post("/recommend", recipeController.getRecommendedRecipes);
router.post("/create", recipeController.createRecipe);

module.exports = router;