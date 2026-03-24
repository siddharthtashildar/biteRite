const express = require("express");
const router = express.Router();

const User = require("../models/User");

const {
  saveUserData,
  checkUser,   // ✅ MAKE SURE THIS IS IMPORTED
  syncUser,
  getUserByClerkId,
  updateUser
} = require("../controllers/userController");
console.log("checkUser:", checkUser);
router.post("/onboarding", saveUserData);
router.post("/save", syncUser);
router.get("/check/:clerkId", checkUser); // ✅ now valid
router.get("/:clerkId", getUserByClerkId);
router.put("/:clerkId", updateUser); // ✅ ADD THIS

router.get("/recipes/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId })
      .populate("recipesGenerated")
      .populate("savedRecipes")
      .populate("favorites");

    if (!user) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      generated: user.recipesGenerated,
      saved: user.savedRecipes,
      favorites: user.favorites
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// 🔥 SAVE RECIPE
router.post("/save/:recipeId", async (req, res) => {
  try {
    const { clerkId } = req.body;
    const { recipeId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) return res.status(404).json({ success: false });

    const alreadySaved = user.savedRecipes.includes(recipeId);

    if (alreadySaved) {
      // 🔥 REMOVE (toggle)
      user.savedRecipes.pull(recipeId);
    } else {
      user.savedRecipes.push(recipeId);
    }

    await user.save();

    res.json({
      success: true,
      saved: !alreadySaved
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// 🔥 FAVORITE RECIPE
router.post("/favorite/:recipeId", async (req, res) => {
  try {
    const { clerkId } = req.body;
    const { recipeId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) return res.status(404).json({ success: false });

    const alreadyFav = user.favorites.includes(recipeId);

    if (alreadyFav) {
      user.favorites.pull(recipeId);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();

    res.json({
      success: true,
      favorite: !alreadyFav
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;