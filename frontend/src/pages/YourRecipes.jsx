import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { FiPlus, FiArrowRight, FiTrash } from "react-icons/fi";

function YourRecipes({ initialTab = "All Recipes" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const [yourRecipes, setYourRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (!user) return;

    const fetchYourRecipes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/recipes/${user.id}`
        );

        const data = await res.json();

        if (data.success) {
          setYourRecipes(data.generated || []);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchYourRecipes();
  }, [user]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");

    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab(initialTab);
    }
  }, [location.search, initialTab]);

  const pendingRecipes = yourRecipes.filter((r) => r.pendingVerification);
  const verifiedRecipes = yourRecipes.filter((r) => r.verifiedByDietician);
  const uploadedRecipes = yourRecipes.filter((r) => r.isUserCreated);

  const displayedRecipes =
    activeTab === "Pending Verification"
      ? pendingRecipes
      : activeTab === "Verified Recipes"
      ? verifiedRecipes
      : activeTab === "Uploaded Recipes"
      ? uploadedRecipes
      : yourRecipes;

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clerkId: user.id }),
      });

      const data = await res.json();

      if (data.success) {
        // Remove from local state
        setYourRecipes(prev => prev.filter(r => r._id !== recipeId));
        alert("Recipe deleted successfully");
      } else {
        alert(data.message || "Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe");
    }
  };

  return (
    <div className={`flex min-h-screen bg-[#f3efe9] dark:bg-gray-900 transition`}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className={`flex-1 p-10 main-content`}>

        <Navbar onCreate={() => navigate("/?create=true")} />

        {/* HEADER */}
        <div className="mt-8 mb-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                  Your Recipes
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage all your recipes in one place: all, pending and verified.
                </p>
              </div>

              <button
                onClick={() => navigate("/")}
                className="
                  flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full text-sm font-medium 
                  border border-green-500 hover:bg-green-200 transition
                "
              >
                <FiPlus size={16} />
                Create New Recipe
              </button>
            </div>

            {/* TABS */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Recipes", count: yourRecipes.length },
                { label: "Uploaded Recipes", count: uploadedRecipes.length },
                { label: "Pending Verification", count: pendingRecipes.length },
                { label: "Verified Recipes", count: verifiedRecipes.length }
              ].map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${activeTab === tab.label ? "bg-orange-100 text-orange-700 border-orange-400" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RECIPES GRID */}
        {displayedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRecipes.map((recipe) => (
              <div key={recipe._id} className="relative">
                <RecipeCard
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe._id}`, { state: recipe })}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRecipe(recipe._id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  title="Delete Recipe"
                >
                  <FiTrash size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiPlus size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {activeTab === "All Recipes" ? "No recipes yet" : `No ${activeTab.toLowerCase()} found`}
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              {activeTab === "All Recipes"
                ? "Create your first recipe to get started"
                : activeTab === "Pending Verification"
                  ? "Recipes you send for verification show up here."
                  : "Verified recipes will appear here once dieticians approve them."
              }
            </p>
            <button
              onClick={() => navigate("/")}
              className="
                bg-green-100 text-green-700 px-6 py-3 rounded-full text-sm font-medium 
                border border-green-500 hover:bg-green-200 transition
              "
            >
              Create Your First Recipe
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default YourRecipes;