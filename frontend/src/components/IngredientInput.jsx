import { useState } from "react";

function IngredientInput({ onGenerate }) {
  const [ingredients, setIngredients] = useState("");
  const [health, setHealth] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleHealth = (item) => {
    if (health.includes(item)) {
      setHealth(health.filter((h) => h !== item));
    } else {
      setHealth([...health, item]);
    }
  };

  const handleGenerate = async () => {

    console.log("Generate button clicked i am gay ");

    if (!ingredients.trim()) {
      alert("Please enter at least one ingredient");
      return;
    }

    const ingredientArray = ingredients
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
          console.log("Ingredients array:", ingredientArray);
    console.log("Calling parent:", onGenerate);
    console.log("Ingredients array:", ingredientArray);
    try {
      setLoading(true);

      await onGenerate(ingredientArray, health);

    } catch (error) {
      console.error("Recipe generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
      <h2 className="text-lg font-semibold mb-4">Generate Recipe</h2>

      <input
        type="text"
        placeholder="Enter ingredients (eg. tomato, onion, eggs)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-4"
      />

      <p className="text-sm font-medium mb-2">Health Conditions</p>

      <div className="flex gap-3 flex-wrap mb-4">
        {["Diabetes", "Low BP", "Gluten Free", "Vegan"].map((item) => (
          <button
            key={item}
            onClick={() => toggleHealth(item)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              health.includes(item)
                ? "bg-green-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`px-6 py-2 rounded-lg text-white ${
          loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>
    </div>
  );
}

export default IngredientInput;