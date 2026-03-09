const express = require("express");
const router = express.Router();

const recipeController = require("../controllers/recipeController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, recipeController.createRecipe);

router.post("/recommend", recipeController.getRecommendedRecipes);

router.get("/:id", recipeController.getRecipeById);

module.exports = router;