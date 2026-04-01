import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { FiBookmark, FiArrowRight } from "react-icons/fi";

function SavedRecipes() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchSavedRecipes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/recipes/${user.id}`
        );

        const data = await res.json();

        if (data.success) {
          setSavedRecipes(data.saved || []);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedRecipes();
  }, [user]);

  return (
    <div className={`flex min-h-screen bg-[#f3efe9] dark:bg-gray-900 transition`}>


      <Sidebar />


      <div className={`flex-1 p-10 main-content`}>

        <Navbar />

        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Saved Recipes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your saved recipes for later
          </p>
        </div>

        {/* SAVED RECIPES GRID */}
        <div className="grid grid-cols-3 gap-8">
          {savedRecipes.length > 0 ? (
            savedRecipes.map((recipe, i) => (
              <RecipeCard
                key={i}
                recipe={recipe}
                onClick={(r) =>
                  navigate(`/recipe/${r._id}`, { state: r })
                }
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-20">
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No saved recipes yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Save recipes you like to access them quickly here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SavedRecipes;