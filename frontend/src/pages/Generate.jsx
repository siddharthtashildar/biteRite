import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";

import { useUser } from "@clerk/clerk-react";



function Generate() {
  const [ingredients, setIngredients] = useState("");
  const [health, setHealth] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

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
    setRecipes([]); // 🔥 clear old results

    try {
      const response = await fetch("http://localhost:5000/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ingredients: ingredients.split(","),
          healthConditions: health,
          clerkId: user.id   // 🔥 REQUIRED
        })
      });

      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipe);
      }

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f6f4ef] dark:bg-gray-900 transition">

      <Sidebar />

      <div className="flex-1 p-10 main-content">

        <Navbar />

        {/* TITLE */}
        <h1 className="text-3xl font-semibold mt-8 mb-8 text-black dark:text-white">
          Generate Smart Recipe
        </h1>

        {/* INPUT CARD */}
        <div className="
          relative bg-white dark:bg-gray-800 
          rounded-3xl p-8 shadow-md mb-10 overflow-hidden
        ">

          {/* 🌟 GLOW */}
          <div className="absolute right-10 top-10 w-60 h-60 bg-green-200 blur-3xl opacity-20 rounded-full"></div>

          {/* TEXTAREA */}
          <textarea
            placeholder="Enter ingredients (e.g. tomato, onion, eggs...)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="
              w-full h-28 p-4 border rounded-xl mb-6 resize-none
              bg-gray-50 dark:bg-gray-700
              text-black dark:text-white
              border-gray-200 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-green-400
            "
          />

          {/* HEALTH TAGS */}
          <div className="flex flex-wrap gap-3 mb-6">
            {["Diabetes", "Low BP", "Gluten Free", "Vegan"].map((item) => (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`
                  px-4 py-1.5 rounded-full text-sm border transition
                  ${health.includes(item)
                    ? "bg-green-500 text-white"
                    : "bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleGenerate}
            className="
              bg-green-500 text-white px-8 py-3 rounded-xl font-medium
              shadow-md hover:scale-105 hover:bg-green-600 transition
            "
          >
            {loading ? "Generating..." : "Generate Recipe"}
          </button>

          {/* 🔥 LOADING BAR */}
          {loading && (
            <div className="mt-6">
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-pulse w-2/3"></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Cooking something amazing...
              </p>
            </div>
          )}

        </div>

        {/* RESULTS */}
        {recipes.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
              Generated Recipes
            </h2>

            <div className="grid grid-cols-3 gap-6">

              {recipes.map((recipe, index) => {
                const formattedRecipe = {
                  ...recipe,
                  title: recipe.title,
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