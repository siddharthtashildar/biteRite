import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { FiSearch } from "react-icons/fi";

function VerifiedRecipes() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [verifiedRecipes, setVerifiedRecipes] = useState([]);

  useEffect(() => {
    const fetchVerifiedRecipes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/recipes/verified`
        );

        const data = await res.json();

        if (data.success) {
          setVerifiedRecipes(data.recipes || []);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchVerifiedRecipes();
  }, []);

  return (
    <div className={`flex min-h-screen bg-[#f3efe9] dark:bg-gray-900 transition`}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className={`flex-1 p-10 main-content`}>

        <Navbar />

        {/* HEADER */}
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Verified Recipes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Recipes verified by professional dieticians
          </p>
        </div>

        {/* VERIFIED RECIPES GRID */}
        <div className="grid grid-cols-3 gap-8">
          {verifiedRecipes.length > 0 ? (
            verifiedRecipes.map((recipe, i) => (
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
              <div className="text-6xl mb-4 text-blue-400">
                <FiSearch />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No verified recipes yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Verified recipes will appear here once dieticians review them.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default VerifiedRecipes;