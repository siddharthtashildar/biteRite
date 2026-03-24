const express = require("express");

const { generateRecipeController } = require("../controllers/recipeController");

const router = express.Router();

const Recipe = require("../models/Recipe");

router.post("/generate", generateRecipeController);

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const recipes = await Recipe.find({
      title: { $regex: q, $options: "i" }
    }).limit(5);

    res.json({ success: true, recipes });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.get("/recent/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    const recipes = await Recipe.find({ createdBy: clerkId })
      .sort({ createdAt: -1 }) // 🔥 latest first
      .limit(6);

    res.json({ success: true, recipes });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;