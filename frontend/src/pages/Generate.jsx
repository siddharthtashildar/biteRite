import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";

function Generate() {
  const [ingredients, setIngredients] = useState("");
  const [health, setHealth] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggle = (item) => {
    if (health.includes(item)) {
      setHealth(health.filter((h) => h !== item));
    } else {
      setHealth([...health, item]);
    }
  };

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ingredients: ingredients.split(","),
          healthConditions: health
        })
      });

      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipe); // 👈 store recipes
      }

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f6f4ef]">
      <Sidebar />

      <div className="flex-1 p-10">
        <Navbar />

        <h1 className="text-3xl font-semibold mt-8 mb-8">
          Generate Smart Recipe
        </h1>

        {/* INPUT CARD */}
        <div className="bg-white rounded-3xl p-8 shadow-md mb-10">

          <textarea
            placeholder="Enter ingredients (e.g. tomato, onion, eggs...)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full h-28 p-4 border rounded-xl bg-gray-50 mb-6"
          />

          <div className="flex flex-wrap gap-3 mb-6">
            {["Diabetes", "Low BP", "Gluten Free", "Vegan"].map((item) => (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`px-4 py-1.5 rounded-full text-sm border ${
                  health.includes(item)
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            className="bg-green-500 text-white px-8 py-3 rounded-xl"
          >
            {loading ? "Generating..." : "Generate Recipe"}
          </button>
        </div>

        {/* RESULTS */}
        {recipes.length > 0 && (
  <>
    <h2 className="text-xl font-semibold mb-4">
      Generated Recipes
    </h2>

    <div className="grid grid-cols-3 gap-6">

      {recipes.map((recipe, index) => {
        const formattedRecipe = {
          ...recipe,
          title: recipe.title, // 🔥 FIX
          time: recipe.time || "20 mins"
        };

        return (
          <RecipeCard
            key={index}
            recipe={formattedRecipe}
            onClick={(r) =>
              navigate(`/recipe/${index}`, { state: r })
            }
          />
        );
      })}

    </div>
  </>
)}
      </div>
    </div>
  );
}

export default Generate;