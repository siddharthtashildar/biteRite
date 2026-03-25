import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { FiClock, FiArrowRight } from "react-icons/fi";

function PendingVerification() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [pendingRecipes, setPendingRecipes] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchPendingRecipes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/recipes/${user.id}`
        );

        const data = await res.json();

        if (data.success) {
          // Filter recipes that are pending verification
          const pending = (data.generated || []).filter(recipe => recipe.pendingVerification);
          setPendingRecipes(pending);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchPendingRecipes();
  }, [user]);

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
            Pending Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your recipes waiting for dietician review
          </p>
        </div>

        {/* PENDING RECIPES GRID */}
        <div className="grid grid-cols-3 gap-8">
          {pendingRecipes.length > 0 ? (
            pendingRecipes.map((recipe, i) => (
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
              <div className="text-6xl mb-4 text-yellow-400">
                <FiClock />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No pending recipes
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Recipes you submit for verification will appear here.
              </p>
              <button
                onClick={() => navigate("/generate")}
                className="bg-green-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
              >
                Create Recipe <FiArrowRight />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default PendingVerification;