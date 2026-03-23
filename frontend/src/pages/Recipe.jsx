import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

function Recipe() {
  const { state } = useLocation();
  const recipe = state;

  const { user } = useUser();

  const [saved, setSaved] = useState(false);
  const [fav, setFav] = useState(false);

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
      await fetch(`http://localhost:5000/api/users/save/${recipe._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: user.id })
      });

      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FAVORITE API  
  const handleFav = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/favorite/${recipe._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: user.id })
      });

      setFav(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f6f4ef] dark:bg-gray-900">

      <Sidebar />

      <div className="flex-1 p-10">
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
          <div className="absolute top-5 right-5">
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
          <div className="flex justify-end gap-3 mb-6">

            <button
              onClick={handleFav}
              className={`px-4 py-2 rounded-xl text-sm transition ${fav
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                }`}
            >
              ❤️ Favorite
            </button>

            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-xl text-sm transition ${saved
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                }`}
            >
              💾 Save
            </button>

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