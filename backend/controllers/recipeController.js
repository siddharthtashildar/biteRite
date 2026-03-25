const { generateRecipe } = require("../services/geminiService");
const { fetchRecipeImage } = require("../services/imageService");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

console.log("API KI MAA KAA")

// 🔥 normalize diet type
function normalizeDiet(type) {
  if (!type) return "veg";

  type = type.toLowerCase();

  if (type.includes("vegan")) return "vegan";
  if (type.includes("non")) return "non-veg";

  return "veg";
}

function transformRecipe(r, image, clerkId) {

  return {
    title: r.title || "Untitled",

    image,

    ingredients: r.ingredients || [],

    instructions: r.instructions || [],

    cookingTime: parseInt(r.time) || 20,

    dietType: normalizeDiet(r.dietType),

    nutrition: {
      calories: parseInt(r.calories) || 0,
      protein: parseInt(r.protein) || 0,
      carbs: parseInt(r.carbs) || 0,
      fat: parseInt(r.fat) || 0
    },

    healthTags: r.healthTags || [],

    createdBy: clerkId
  };
}

async function generateRecipeController(req, res) {
  try {

    console.log("API HITTTT")
    const { ingredients, healthConditions, clerkId } = req.body;

    let recipes = await generateRecipe(ingredients, healthConditions);

    // 🛠️ parse Gemini response
    if (typeof recipes === "string") {
      recipes = JSON.parse(recipes);
    }

    if (!Array.isArray(recipes)) {
      recipes = [recipes];
    }

    // 🔥 process all recipes
    const savedRecipes = [];

    for (let r of recipes) {

      let image = "https://via.placeholder.com/300";

      try {
        image = await fetchRecipeImage(r.imageQuery || r.title);
      } catch { }

      const cleanRecipe = transformRecipe(r, image, clerkId);

      const newRecipe = await Recipe.create(cleanRecipe);

      savedRecipes.push(newRecipe);

      await User.findOneAndUpdate(
        { clerkId },
        { $addToSet: { recipesGenerated: newRecipe._id } }
      );
    }

    res.json({
      success: true,
      recipe: savedRecipes
    });

  } catch (error) {
    console.error("Recipe generation error:", error);

    res.status(500).json({
      success: false,
      message: "Recipe generation failed"
    });
  }
}

// 🔥 SEND RECIPE FOR VERIFICATION
async function sendForVerification(req, res) {
  try {
    const { recipeId } = req.params;
    const { clerkId } = req.body;

    console.log("📤 Sending recipe for verification. RecipeId:", recipeId, "ClerkId:", clerkId);

    // Verify that the user owns the recipe
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      console.log("❌ Recipe not found");
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    console.log("🍳 Recipe found:", recipe.title, "Created by:", recipe.createdBy);

    if (recipe.createdBy !== clerkId) {
      console.log("❌ Ownership mismatch. Recipe creator:", recipe.createdBy, "Requesting user:", clerkId);
      return res.status(403).json({ success: false, message: "You can only send your own recipes for verification" });
    }

    // Update recipe to mark as pending verification
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { pendingVerification: true },
      { new: true }
    );

    console.log("✅ Recipe updated. pendingVerification:", updatedRecipe.pendingVerification);

    res.json({
      success: true,
      message: "Recipe sent for verification",
      recipe: updatedRecipe
    });

  } catch (error) {
    console.error("Send for verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// 🔥 GET PENDING VERIFICATION RECIPES (for dieticians)
async function getPendingVerificationRecipes(req, res) {
  try {
    const { clerkId } = req.params;

    console.log("📋 Fetching pending recipes for clerkId:", clerkId);

    // Verify that the user is a dietician
    const user = await User.findOne({ clerkId });

    console.log("👤 User found:", user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("👥 User role:", user.role);

    if (user.role !== "dietician") {
      console.log("❌ User is not a dietician");
      return res.status(403).json({ success: false, message: `User role is ${user.role}, not dietician` });
    }

    // Get all recipes pending verification (simplified filter)
    const query = {
      pendingVerification: true,
      verifiedByDietician: false
    };

    console.log("🔎 Query:", query);

    const pendingRecipes = await Recipe.find(query)
      .populate("dieticianVerifiedBy", "name email")
      .sort({ createdAt: -1 });

    console.log("📦 Found recipes:", pendingRecipes.length);

    // Manually fetch creator info for each recipe
    const recipesWithCreator = await Promise.all(
      pendingRecipes.map(async (recipe) => {
        const creator = await User.findOne({ clerkId: recipe.createdBy });
        return {
          ...recipe.toObject(),
          creatorInfo: creator ? { name: creator.name, email: creator.email } : { name: "Unknown", email: "" }
        };
      })
    );

    console.log("✅ Returning recipes with creator info");
    res.json({
      success: true,
      recipes: recipesWithCreator
    });

  } catch (error) {
    console.error("Get pending recipes error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// 🔥 VERIFY RECIPE (dietician verifies recipe)
async function verifyRecipe(req, res) {
  try {
    const { recipeId } = req.params;
    const { clerkId } = req.body;

    // Verify that the user is a dietician
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ success: false, message: "Dietician not found" });
    }

    if (user.role !== "dietician") {
      return res.status(403).json({ success: false, message: "Only dieticians can verify recipes" });
    }

    // Update recipe to mark as verified
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        verifiedByDietician: true,
        pendingVerification: false,
        dieticianVerifiedBy: user._id,
        verificationDate: new Date()
      },
      { new: true }
    ).populate("dieticianVerifiedBy", "name email");

    res.json({
      success: true,
      message: "Recipe verified successfully",
      recipe: updatedRecipe
    });

  } catch (error) {
    console.error("Verify recipe error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// 🔥 REJECT RECIPE (dietician rejects recipe with feedback)
async function rejectRecipe(req, res) {
  try {
    const { recipeId } = req.params;
    const { clerkId, reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: "Rejection reason is required" });
    }

    // Verify that the user is a dietician
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ success: false, message: "Dietician not found" });
    }

    if (user.role !== "dietician") {
      return res.status(403).json({ success: false, message: "Only dieticians can reject recipes" });
    }

    // Update recipe to mark as rejected
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        pendingVerification: false,
        rejectionReason: reason,
        dieticianRejectedBy: user._id,
        rejectionDate: new Date()
      },
      { new: true }
    ).populate("dieticianRejectedBy", "name email");

    res.json({
      success: true,
      message: "Recipe rejected successfully",
      recipe: updatedRecipe
    });

  } catch (error) {
    console.error("Reject recipe error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { 
  generateRecipeController,
  sendForVerification,
  getPendingVerificationRecipes,
  verifyRecipe,
  rejectRecipe
};