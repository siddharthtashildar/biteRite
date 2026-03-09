const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.put("/profile", auth, userController.updateProfile);

router.post("/save-recipe", auth, userController.saveRecipe);

router.get("/saved-recipes", auth, userController.getSavedRecipes);

module.exports = router;