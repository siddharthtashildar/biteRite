function RecipeCard({ recipe, onClick }) {
  return (
    <div
      onClick={() => onClick(recipe)}
      className="
        group cursor-pointer
        bg-white dark:bg-gray-800 
        rounded-2xl p-4 shadow-sm
        hover:shadow-lg hover:-translate-y-1
        transition-all duration-300
      "
    >

      {/* IMAGE */}
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="
            h-40 w-full object-cover
            group-hover:scale-105 transition duration-300
          "
        />

        {/* 🔥 GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70"></div>

        {/* TIME BADGE */}
        <span className="
          absolute bottom-2 left-2
          text-xs bg-white/90 text-black
          px-2 py-1 rounded-full
        ">
          ⏱ {recipe.time}
        </span>
      </div>

      {/* TEXT */}
      <h3 className="font-semibold text-black dark:text-white mb-1">
        {recipe.title}
      </h3>

      {/* OPTIONAL: CALORIES */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        🔥 {recipe.calories || "Healthy"}
      </p>

    </div>
  );
}

export default RecipeCard;