import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

function Recipe() {
  const { state } = useLocation();
  const recipe = state;

  const [saved, setSaved] = useState(false);
  const [fav, setFav] = useState(false);

  if (!recipe) return <p>No recipe found</p>;

  return (
    <div className="flex min-h-screen bg-[#f6f4ef] dark:bg-gray-900">

      <Sidebar />

      <div className="flex-1 p-10">
        <Navbar />

        {/* 🔥 HERO IMAGE */}
        <div className="w-full h-72 rounded-3xl overflow-hidden shadow-md mt-8 mb-8">
          <img
            src={recipe.image}
            className="w-full h-full object-cover"
          />
        </div>

        {/* MAIN CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">

            <div>
              <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">
                {recipe.title}
              </h1>

              <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span>🔥 {recipe.calories || "250 kcal"}</span>
                <span>⏱ {recipe.time || "20 mins"}</span>
                <span>🍽 Serves 2</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={() => setFav(!fav)}
                className={`px-4 py-2 rounded-xl text-sm transition ${
                  fav
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                }`}
              >
                ❤️ Favorite
              </button>

              <button
                onClick={() => setSaved(!saved)}
                className={`px-4 py-2 rounded-xl text-sm transition ${
                  saved
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                }`}
              >
                💾 Save
              </button>

            </div>
          </div>

          {/* 🧠 NUTRITION */}
          <div className="mb-10">
            <h2 className="font-semibold mb-4 text-black dark:text-white">
              Nutrition
            </h2>

            <div className="grid grid-cols-4 gap-4">

              {[
                { label: "Calories", value: recipe.calories || "250" },
                { label: "Protein", value: recipe.protein || "15g" },
                { label: "Carbs", value: recipe.carbs || "30g" },
                { label: "Fat", value: recipe.fat || "10g" },
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
                {recipe.ingredients?.map((item, i) => (
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

              <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                {recipe.instructions?.map((step, i) => (
                  <li key={i}>
                    <span className="font-semibold text-black dark:text-white">
                      Step {i + 1}:
                    </span>{" "}
                    {step}
                  </li>
                ))}
              </ol>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Recipe;