const { generateRecipe } = require("../services/geminiService");
const { fetchRecipeImage } = require("../services/imageService");

async function generateRecipeController(req, res) {
  try {

    const { ingredients, healthConditions } = req.body;

    let recipes = await generateRecipe(ingredients, healthConditions);

    // parse if Gemini returned string
    if (typeof recipes === "string") {
      recipes = JSON.parse(recipes);
    }

    if (!Array.isArray(recipes)) {
      recipes = [recipes];
    }

    // fetch images
    await Promise.all(
      recipes.map(async (recipe) => {
        const title = recipe.imageQuery;
        recipe.image = await fetchRecipeImage(title);
      })
    );

    res.json({
      success: true,
      recipe: recipes
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