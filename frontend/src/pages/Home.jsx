import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import IngredientInput from "../components/IngredientInput";
import CommunityFeed from "../components/CommunityFeed";
import { generateRecipes } from "../services/geminiService";

function Home() {
  const [recipes, setRecipes] = useState([
    { title: "Special Salad Chicken", time: "20 mins" },
    { title: "Noodle Chicken", time: "20 mins" },
    { title: "Chicken with green veg", time: "20 mins" },
    { title: "Spicy Chicken Bowl", time: "20 mins" },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleGenerate = async (ingredients, health) => {
    if (!ingredients) return;
    setLoading(true);
    const newRecipes = await generateRecipes(ingredients, health);
    if (newRecipes.length > 0) {
      setRecipes(newRecipes);
    }
    setLoading(false);
  };

  const saveRecipeToDb = async (recipe) => {
    try {
      const response = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });
      if (response.ok) alert("Recipe saved successfully!");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe. Is the backend running?");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f6f4ef]">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar />

        <h1 className="text-3xl font-semibold mt-8 mb-4">
          Learn, Cook & Eat Healthy
        </h1>

        {/* Ingredient Input */}
        <IngredientInput onGenerate={handleGenerate} />

        {/* Recipe Section */}
        <h2 className="text-xl font-semibold mb-4">Recommended Recipes</h2>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Generating recipes...</div>
        ) : (
          <div className="grid grid-cols-4 gap-6 mb-10">
            {recipes.map((recipe, i) => (
              <RecipeCard key={i} recipe={recipe} onClick={setSelectedRecipe} />
            ))}
          </div>
        )}

        {/* Community Section */}
        <CommunityFeed />

        {/* Recipe Details Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedRecipe.title}</h2>
                <button onClick={() => setSelectedRecipe(null)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
              </div>
              
              <div className="flex gap-4 text-sm text-gray-600 mb-6">
                <span>🕒 {selectedRecipe.time}</span>
                <span>🔥 {selectedRecipe.calories || "N/A"}</span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {selectedRecipe.ingredients?.map((ing, i) => <li key={i}>{ing}</li>) || <p>No ingredients listed.</p>}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  {selectedRecipe.instructions?.map((step, i) => <li key={i}>{step}</li>) || <p>No instructions listed.</p>}
                </ol>
              </div>

              <button onClick={() => saveRecipeToDb(selectedRecipe)} className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600">
                Save to Collection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;