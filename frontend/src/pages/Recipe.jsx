import { useLocation, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect} from "react";
import { useUser } from "@clerk/clerk-react";
import { FiHeart, FiSave, FiSend, FiClock, FiCheckCircle } from "react-icons/fi";

function Recipe() {
  const location = useLocation();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);

  const { user } = useUser();

  useEffect(() => {
    if (recipe || !id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/recipes/${id}`);
        const data = await res.json();

        if (data.success) {
          setRecipe(data.recipe);
        }
      } catch (err) {
        console.error("Failed to fetch recipe by ID", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, recipe]);

  const [saved, setSaved] = useState(false);
  const [fav, setFav] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>No recipe found</p>;

  const {
    title = "Untitled Recipe",
    image = "https://via.placeholder.com/800",
    cookingTime = 20,
    dietType = "veg",
    ingredients = [],
    instructions = [],
    nutrition = {}
  } = recipe;

  // 🔥 extract nutrition safely
  const {
    calories = 250,
    protein = 15,
    carbs = 30,
    fat = 10
  } = nutrition;

  // 🔥 SAVE API
  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/save/${recipe._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: user.id })
        }
      );

      const data = await res.json();

      setSaved(data.saved); // 🔥 dynamic toggle

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FAVORITE API  
  const handleFav = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/favorite/${recipe._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: user.id })
        }
      );

      const data = await res.json();

      setFav(data.favorite); // 🔥 dynamic toggle

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 SEND FOR VERIFICATION
  const handleSendForVerification = async () => {
    try {
      console.log("📤 Sending recipe for verification. RecipeId:", recipe._id, "ClerkId:", user.id);

      const res = await fetch(
        `http://localhost:5000/api/recipes/${recipe._id}/send-for-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: user.id })
        }
      );

      const data = await res.json();

      console.log("Response:", data);

      if (data.success) {
        setPendingVerification(true);
        alert("✅ Recipe sent for verification!");
      } else {
        alert("❌ Error: " + (data.message || "Failed to send recipe for verification"));
      }

    } catch (err) {
      console.error("❌ Error sending for verification:", err);
      alert("❌ Error: " + err.message);
    }
  };

  useEffect(() => {
    if (!user || !recipe?._id) return;

    const checkStatus = async () => {
      const res = await fetch(
        `http://localhost:5000/api/users/recipes/${user.id}`
      );

      const data = await res.json();

      if (data.success) {
        setSaved(
          data.saved.some(r => r._id === recipe._id)
        );

        setFav(
          data.favorites.some(r => r._id === recipe._id)
        );
      }
    };

    // Check verification status
    setPendingVerification(recipe?.pendingVerification || false);
    setIsVerified(recipe?.verifiedByDietician || false);

    checkStatus();
  }, [user, recipe]);
  return (
    <div className="flex min-h-screen bg-[#f6f4ef] dark:bg-gray-900">

      <Sidebar />

      <div className="flex-1 p-10 main-content">
        <Navbar />

        {/* 🔥 HERO IMAGE */}
        <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-md mt-8 mb-10">

          <img
            src={image}
            className="w-full h-full object-cover"
          />

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* TEXT ON IMAGE */}
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold">{title}</h1>

            <p className="text-sm opacity-80">
              ⏱ {cookingTime} Mins • 🔥 {calories} kcal
            </p>
          </div>

          {/* DIET TAG */}
          <div className="absolute top-5 right-5 flex gap-2">
            {isVerified && (
              <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-500 text-white flex items-center gap-1">
                <FiCheckCircle className="w-3 h-3" /> Verified by Dietician
              </span>
            )}
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${dietType === "veg"
              ? "bg-green-500 text-white"
              : dietType === "vegan"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
              }`}>
              {dietType}
            </span>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md">

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mb-6 flex-wrap">

            <button
              onClick={handleFav}
              className={`px-4 py-2 rounded-xl text-sm transition ${fav
                ? "bg-red-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                } flex items-center gap-2`}
            >
              <FiHeart className="w-4 h-4" /> Favorite
            </button>

            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-xl text-sm transition ${saved
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                } flex items-center gap-2`}
            >
              <FiSave className="w-4 h-4" /> Save
            </button>

            {!isVerified && !pendingVerification && (
              <button
                onClick={handleSendForVerification}
                className="px-4 py-2 rounded-xl text-sm transition bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <FiSend className="w-4 h-4" /> Send for Verification
              </button>
            )}

            {pendingVerification && !isVerified && (
              <button
                disabled
                className="px-4 py-2 rounded-xl text-sm transition bg-yellow-500 text-white opacity-75 cursor-not-allowed flex items-center gap-2"
              >
                <FiClock className="w-4 h-4" /> Pending Verification
              </button>
            )}

            {isVerified && (
              <button
                disabled
                className="px-4 py-2 rounded-xl text-sm transition bg-blue-500 text-white opacity-75 cursor-not-allowed flex items-center gap-2"
              >
                <FiCheckCircle className="w-4 h-4" /> Verified
              </button>
            )}

          </div>

          {/* 🧠 NUTRITION */}
          <div className="mb-10">
            <h2 className="font-semibold mb-4 text-black dark:text-white">
              Nutrition
            </h2>

            <div className="grid grid-cols-4 gap-4">

              {[
                { label: "Calories", value: `${calories}` },
                { label: "Protein", value: `${protein}g` },
                { label: "Carbs", value: `${carbs}g` },
                { label: "Fat", value: `${fat}g` },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-center"
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
          </div>

          {/* VERIFICATION INFO */}
          {isVerified && recipe.dieticianVerifiedBy && (
            <div className="mb-10">
              <h2 className="font-semibold mb-4 text-black dark:text-white">
                Verification Details
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4" /> Verified by: <span className="font-medium">{recipe.dieticianVerifiedBy.name || "Dietician"}</span>
                </p>
                {recipe.verificationDate && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Verified on: {new Date(recipe.verificationDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 📦 CONTENT */}
          <div className="grid grid-cols-3 gap-8">

            {/* INGREDIENTS */}
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-2xl">
              <h2 className="font-semibold mb-4 text-black dark:text-white">
                Ingredients
              </h2>

              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {ingredients.map((item, i) => (
                  <li key={i} className="border-b border-gray-200 dark:border-gray-600 pb-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* INSTRUCTIONS */}
            <div className="col-span-2">
              <h2 className="font-semibold mb-4 text-black dark:text-white">
                Instructions
              </h2>

              <ol className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                {instructions.length > 0 ? (
                  instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No instructions available</p>
                )}
              </ol>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Recipe;