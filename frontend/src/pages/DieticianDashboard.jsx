import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FiClock, FiZap, FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

function DieticianDashboard() {
  const { user } = useUser();

  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [verifiedRecipes, setVerifiedRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch pending verification recipes
  useEffect(() => {
    if (!user) return;

    fetchRecipes();
  }, [user]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      
      console.log("🔍 Fetching recipes for dietician:", user.id);
      
      // Fetch pending recipes
      const pendingRes = await fetch(
        `http://localhost:5000/api/recipes/pending-verification/${user.id}`
      );
      const pendingData = await pendingRes.json();

      console.log("Pending recipes response:", pendingData);

      if (pendingData.success) {
        setPendingRecipes(pendingData.recipes);
      } else {
        console.error("❌ Pending recipes error:", pendingData.message);
        alert("Error loading pending recipes: " + (pendingData.message || "Unknown error"));
      }

      // Fetch verified recipes
      const verifiedRes = await fetch(
        `http://localhost:5000/api/recipes/verified/${user.id}`
      );
      const verifiedData = await verifiedRes.json();

      console.log("Verified recipes response:", verifiedData);

      if (verifiedData.success) {
        setVerifiedRecipes(verifiedData.recipes);
      } else {
        console.error("❌ Verified recipes error:", verifiedData.message);
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (recipeId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/recipes/${recipeId}/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: user.id })
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Recipe verified successfully!");

        // Move recipe to verified
        const verified = pendingRecipes.find(r => r._id === recipeId);
        setPendingRecipes(pendingRecipes.filter(r => r._id !== recipeId));
        setVerifiedRecipes([...verifiedRecipes, data.recipe]);
        setSelectedRecipe(null);
      } else {
        alert("Error verifying recipe: " + data.message);
      }
    } catch (err) {
      console.error("Error verifying recipe:", err);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/recipes/${selectedRecipe._id}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: user.id, reason: rejectionReason })
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Recipe rejected successfully!");

        // Remove from pending
        setPendingRecipes(pendingRecipes.filter(r => r._id !== selectedRecipe._id));
        setSelectedRecipe(null);
        setRejectMode(false);
        setRejectionReason("");
      } else {
        alert("Error rejecting recipe: " + data.message);
      }
    } catch (err) {
      console.error("Error rejecting recipe:", err);
    }
  };

  const RecipeCard = ({ recipe, isPending = false }) => (
    <div
      onClick={() => setSelectedRecipe(recipe)}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          {recipe.title}
        </h3>

        <div className="flex gap-2 mb-3">
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              recipe.dietType === "veg"
                ? "bg-green-100 text-green-700"
                : recipe.dietType === "vegan"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {recipe.dietType}
          </span>

          {isPending && (
            <span className="px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
              <FiLoader className="w-3 h-3" /> Pending
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
          <FiClock className="w-4 h-4" /> {recipe.cookingTime} mins • <FiZap className="w-4 h-4" /> {recipe.nutrition?.calories || 0} kcal
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-500">
          By: {recipe.creatorInfo?.name || recipe.createdBy || "Unknown"}
        </p>

        {!isPending && recipe.dieticianVerifiedBy && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
            <FiCheckCircle className="w-3 h-3" /> Verified by: {typeof recipe.dieticianVerifiedBy === 'object' ? recipe.dieticianVerifiedBy.name : "Dietician"}
          </p>
        )}
      </div>
    </div>
  );

  const RecipeDetailsModal = ({ recipe }) => {
    if (!recipe) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              {recipe.title}
            </h2>
            <button
              onClick={() => setSelectedRecipe(null)}
              className="text-2xl text-gray-600 hover:text-black dark:text-gray-400"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            {/* Creator and Verification Info */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Created by: <span className="font-semibold text-black dark:text-white">{recipe.creatorInfo?.name || "Unknown"}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {recipe.creatorInfo?.email || ""}
                  </p>
                </div>
                {recipe.verifiedByDietician && recipe.dieticianVerifiedBy && (
                  <div className="text-right">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                      <FiCheckCircle className="w-4 h-4" /> Verified
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      By: {typeof recipe.dieticianVerifiedBy === 'object' ? recipe.dieticianVerifiedBy.name : "Dietician"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Calories", value: recipe.nutrition?.calories || 0 },
                { label: "Protein", value: `${recipe.nutrition?.protein || 0}g` },
                { label: "Carbs", value: `${recipe.nutrition?.carbs || 0}g` },
                { label: "Fat", value: `${recipe.nutrition?.fat || 0}g` }
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center"
                >
                  <p className="text-lg font-bold text-black dark:text-white">
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-3">
                  Ingredients
                </h3>
                <ul className="space-y-2">
                  {recipe.ingredients?.map((ingredient, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                      • {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-black dark:text-white mb-3">
                  Instructions
                </h3>
                <ol className="space-y-2">
                  {recipe.instructions?.map((instruction, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{i + 1}.</span> {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Action Buttons */}
            {recipe.pendingVerification && !rejectMode && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleVerify(recipe._id)}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <FiCheckCircle className="w-4 h-4" /> Verify Recipe
                </button>
                <button
                  onClick={() => setRejectMode(true)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  <FiXCircle className="w-4 h-4" /> Reject Recipe
                </button>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="flex-1 bg-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            )}

            {/* Rejection Form */}
            {rejectMode && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3">
                  Rejection Feedback
                </h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide constructive feedback for the recipe creator..."
                  className="w-full p-3 border border-red-300 rounded-lg dark:bg-gray-700 dark:border-red-600 dark:text-white text-black mb-3"
                  rows="4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => {
                      setRejectMode(false);
                      setRejectionReason("");
                    }}
                    className="flex-1 bg-gray-300 text-black py-2 rounded-lg font-semibold hover:bg-gray-400 transition dark:bg-gray-700 dark:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!recipe.pendingVerification && !rejectMode && (
              <button
                onClick={() => setSelectedRecipe(null)}
                className="w-full bg-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-400 transition dark:bg-gray-700 dark:text-white"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f6f4ef] dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 p-10 main-content">
        <Navbar />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            🏥 Dietician Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Review and verify recipes submitted by users
          </p>

          {/* TABS */}
          <div className="flex gap-4 mb-8 border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
                activeTab === "pending"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <FiLoader className="w-4 h-4" /> Pending Verification ({pendingRecipes.length})
            </button>

            <button
              onClick={() => setActiveTab("verified")}
              className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
                activeTab === "verified"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <FiCheckCircle className="w-4 h-4" /> Verified ({verifiedRecipes.length})
            </button>
          </div>

          {/* CONTENT */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          )}

          {!loading && activeTab === "pending" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRecipes.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No recipes pending verification
                  </p>
                </div>
              ) : (
                pendingRecipes.map(recipe => (
                  <RecipeCard key={recipe._id} recipe={recipe} isPending={true} />
                ))
              )}
            </div>
          )}

          {!loading && activeTab === "verified" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifiedRecipes.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No verified recipes yet
                  </p>
                </div>
              ) : (
                verifiedRecipes.map(recipe => (
                  <RecipeCard key={recipe._id} recipe={recipe} isPending={false} />
                ))
              )}
            </div>
          )}
        </div>

        {/* MODAL */}
        <RecipeDetailsModal recipe={selectedRecipe} />
      </div>
    </div>
  );
}

export default DieticianDashboard;
