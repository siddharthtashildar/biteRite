const express = require("express");

const { generateRecipeController } = require("../controllers/recipeController");

const router = express.Router();

router.post("/generate", generateRecipeController);

module.exports = router;