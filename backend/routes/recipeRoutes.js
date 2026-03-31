const express = require("express");

const { 
  generateRecipeController,
  createRecipeController,
  sendForVerification,
  getRecipeById,
  getPendingVerificationRecipes,
  verifyRecipe,
  rejectRecipe,
  deleteRecipeController
} = require("../controllers/recipeController");

const router = express.Router();

const Recipe = require("../models/Recipe");
const User = require("../models/User");

router.post("/generate", generateRecipeController);

router.post("/create", createRecipeController);

router.delete("/:recipeId", deleteRecipeController);

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

// 🔥 VERIFICATION ROUTES (SPECIFIC ROUTES FIRST!)
router.get("/pending-verification/:clerkId", getPendingVerificationRecipes);

router.get("/verified", async (req, res) => {
  try {
    // Get all verified recipes for explore
    const verifiedRecipes = await Recipe.find({ verifiedByDietician: true })
      .populate("dieticianVerifiedBy", "name email")
      .sort({ verificationDate: -1 })
      .limit(20);

    // Manually fetch creator info for each recipe
    const recipesWithCreator = await Promise.all(
      verifiedRecipes.map(async (recipe) => {
        const creator = await User.findOne({ clerkId: recipe.createdBy });
        return {
          ...recipe.toObject(),
          creatorInfo: creator ? { name: creator.name, email: creator.email } : { name: "Unknown", email: "" }
        };
      })
    );

    res.json({
      success: true,
      recipes: recipesWithCreator
    });

  } catch (error) {
    console.error("Get verified recipes error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/verified/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    // Verify that the user is a dietician
    const user = await User.findOne({ clerkId });

    if (!user || user.role !== "dietician") {
      return res.status(403).json({ success: false, message: "Only dieticians can view verified recipes" });
    }

    // Get all verified recipes
    const verifiedRecipes = await Recipe.find({ verifiedByDietician: true })
      .populate("dieticianVerifiedBy", "name email")
      .sort({ verificationDate: -1 });

    // Manually fetch creator info for each recipe
    const recipesWithCreator = await Promise.all(
      verifiedRecipes.map(async (recipe) => {
        const creator = await User.findOne({ clerkId: recipe.createdBy });
        return {
          ...recipe.toObject(),
          creatorInfo: creator ? { name: creator.name, email: creator.email } : { name: "Unknown", email: "" }
        };
      })
    );

    res.json({
      success: true,
      recipes: recipesWithCreator
    });

  } catch (error) {
    console.error("Get verified recipes error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GENERIC ROUTES AFTER SPECIFIC ONES
router.post("/:recipeId/send-for-verification", sendForVerification);

router.post("/:recipeId/verify", verifyRecipe);

router.post("/:recipeId/reject", rejectRecipe);

// 🔥 DEBUG: GET ALL RECIPES (for troubleshooting)
router.get("/debug/all-recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find({})
      .select("title createdBy pendingVerification verifiedByDietician rejectionReason createdAt")
      .sort({ createdAt: -1 });

    console.log("📋 All recipes:", recipes.length);

    // Count recipes by status
    const stats = {
      total: recipes.length,
      pending: recipes.filter(r => r.pendingVerification === true).length,
      verified: recipes.filter(r => r.verifiedByDietician === true).length,
      rejected: recipes.filter(r => r.rejectionReason !== null && r.rejectionReason !== undefined).length
    };

    console.log("📊 Stats:", stats);

    res.json({
      success: true,
      ...stats,
      recipes: recipes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔥 DEBUG: GET PENDING RECIPES (test the actual query)
router.get("/debug/pending-test/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    console.log("🔎 Testing pending recipes query for:", clerkId);

    // Test query 1
    const test1 = await Recipe.find({ pendingVerification: true });
    console.log("Test 1 (pendingVerification: true):", test1.length);

    // Test query 2
    const test2 = await Recipe.find({ verifiedByDietician: false });
    console.log("Test 2 (verifiedByDietician: false):", test2.length);

    // Test query 3
    const test3 = await Recipe.find({ pendingVerification: true, verifiedByDietician: false });
    console.log("Test 3 (combined):", test3.length);

    res.json({
      success: true,
      test1: test1.length,
      test2: test2.length,
      test3: test3.length,
      recipes: test3
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔥 FETCH RECIPE BY ID for direct route /recipe/:id
router.get("/:recipeId", getRecipeById);
router.get("/debug/all-recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find({})
      .select("title createdBy pendingVerification verifiedByDietician rejectionReason createdAt")
      .sort({ createdAt: -1 });

    console.log("📋 All recipes:", recipes.length);

    // Count recipes by status
    const stats = {
      total: recipes.length,
      pending: recipes.filter(r => r.pendingVerification === true).length,
      verified: recipes.filter(r => r.verifiedByDietician === true).length,
      rejected: recipes.filter(r => r.rejectionReason !== null && r.rejectionReason !== undefined).length
    };

    console.log("📊 Stats:", stats);

    res.json({
      success: true,
      ...stats,
      recipes: recipes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔥 DEBUG: GET PENDING RECIPES (test the actual query)
router.get("/debug/pending-test/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    console.log("🔎 Testing pending recipes query for:", clerkId);

    // Test query 1
    const test1 = await Recipe.find({ pendingVerification: true });
    console.log("Test 1 (pendingVerification: true):", test1.length);

    // Test query 2
    const test2 = await Recipe.find({ verifiedByDietician: false });
    console.log("Test 2 (verifiedByDietician: false):", test2.length);

    // Test query 3
    const test3 = await Recipe.find({ pendingVerification: true, verifiedByDietician: false });
    console.log("Test 3 (combined):", test3.length);

    res.json({
      success: true,
      test1: test1.length,
      test2: test2.length,
      test3: test3.length,
      recipes: test3
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;