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
    <div className="flex min-h-screen bg-[#f6f4ef] ">

      <Sidebar />

      <div className="flex-1 p-10">
        <Navbar />


        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl p-8 shadow-md mt-10">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-6">

            <div>
              <h1 className="text-3xl font-bold mb-2">
                {recipe.title || recipe.name}
              </h1>

              <div className="flex gap-6 text-sm text-gray-500">
                <span>🔥 {recipe.calories || "250 kcal"}</span>
                <span>⏱ {recipe.time || "20 mins"}</span>
                <span>🍽 Serves 2</span>
              </div>
                          {/* ACTION BUTTONS */}
            <div className="mt-5">

              <button
                onClick={() => setFav(!fav)}
                className={`px-4 py-2 rounded-xl text-sm mr-3 ${
                  fav ? "bg-red-500 text-white" : "bg-gray-100"
                }`}
              >
                ❤️ Favorite
              </button>

              <button
                onClick={() => setSaved(!saved)}
                className={`px-4 py-2 rounded-xl   text-sm ${
                  saved ? "bg-green-500 text-white" : "bg-gray-100"
                }`}
              >
                💾 Save
              </button>
          </div>
            </div>
                   {/* HERO IMAGE */}
        <div className="w-50 h-30 rounded-3xl overflow-hidden mb-8 shadow-md">
          <img
            src={recipe.image}
            className="w-full h-full object-cover"
          />
        </div>



            </div>

        {/* NUTRITION */}
          <div className="mt-10">

            <h2 className="font-semibold mb-4">Nutrition</h2>

            <div className="grid grid-cols-4 gap-4">

              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-lg font-bold">
                  {recipe.calories || "250"}
                </p>
                <p className="text-xs text-gray-500">Calories</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-lg font-bold">
                  {recipe.protein || "15g"}
                </p>
                <p className="text-xs text-gray-500">Protein</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-lg font-bold">
                  {recipe.carbs || "30g"}
                </p>
                <p className="text-xs text-gray-500">Carbs</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-lg font-bold">
                  {recipe.fat || "10g"}
                </p>
                <p className="text-xs text-gray-500">Fat</p>
              </div>

            </div>

          </div>
          {/* CONTENT GRID */}
          <div className="grid grid-cols-3 gap-8 mt-10">

            {/* INGREDIENTS */}
            <div className="bg-gray-50 p-5 rounded-2xl">
              <h2 className="font-semibold mb-4">Ingredients</h2>

              <ul className="space-y-2 text-sm">
                {recipe.ingredients?.map((item, i) => (
                  <li key={i} className="border-b pb-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* INSTRUCTIONS */}
            <div className="col-span-2">
              <h2 className="font-semibold mb-4">Instructions</h2>

              <ol className="space-y-3 text-sm text-gray-700">
                {recipe.instructions?.map((step, i) => (
                  <li key={i}>
                    <span className="font-semibold">Step {i + 1}:</span> {step}
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