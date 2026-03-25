import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Results() {

  const location = useLocation();
  const { ingredients, health } = location.state || {};

  const [recipe, setRecipe] = useState(null);

  useEffect(() => {

    const fetchRecipe = async () => {

      const res = await fetch("http://localhost:5000/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ingredients,
          healthConditions: health
        })
      });

      const data = await res.json();

      setRecipe(data.recipe[0]);
    };

    fetchRecipe();

  }, []);

  return (
    <div className="flex min-h-screen bg-[#f6f4ef]">

      <Sidebar />

      <div className="flex-1 p-8 main-content">

        {!recipe ? (
          <p>Generating...</p>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow max-w-3xl">

            <img
              src={recipe.image}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />

            <h1 className="text-2xl font-bold mb-2">
              {recipe.name}
            </h1>

            <p className="mb-4 text-gray-600">
              🔥 {recipe.calories}
            </p>

            <h3 className="font-semibold">Ingredients</h3>
            <ul className="list-disc ml-6 mb-4">
              {recipe.ingredients.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>

            <h3 className="font-semibold">Steps</h3>
            <ol className="list-decimal ml-6">
              {recipe.instructions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>

          </div>
        )}

      </div>
    </div>
  );
}

export default Results;