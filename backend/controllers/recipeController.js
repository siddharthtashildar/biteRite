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

module.exports = { generateRecipeController };