function RecipeCard({ recipe, onClick }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <img
      src={recipe.image}
      alt={recipe.title}
      className="h-40 w-full object-cover rounded-xl mb-4"
    />

      <h3 className="font-semibold mb-1">{recipe.title}</h3>

      <p className="text-sm text-gray-500 mb-3">{recipe.time}</p>

      <button 
        onClick={() => onClick(recipe)}
        className="w-full py-2 text-sm bg-green-500 text-white rounded-lg"
      >
        View Recipe
      </button>
    </div>
  );
}

export default RecipeCard;