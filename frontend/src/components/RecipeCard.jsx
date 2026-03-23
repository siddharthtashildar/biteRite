function RecipeCard({ recipe, onClick }) {

  const {
    title = "Untitled Recipe",
    image = "https://via.placeholder.com/300",
    cookingTime = 20,
    dietType = "veg",
    nutrition = {}
  } = recipe || {};

  // 🔥 extract nutrition safely
  const {
    calories = 250
  } = nutrition;

  return (
    <div
      onClick={() => onClick(recipe)}
      className="
        group cursor-pointer
        bg-white dark:bg-gray-800
        rounded-2xl p-4 shadow-sm
        hover:shadow-xl hover:-translate-y-2
        transition-all duration-300
      "
    >

      {/* IMAGE */}
      <div className="relative mb-4 overflow-hidden rounded-xl">

        <img
          src={image || "https://via.placeholder.com/300"}
          alt={title}
          className="
            h-44 w-full object-cover
            group-hover:scale-110 transition duration-500
          "
        />

        {/* 🔥 GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

        {/* ⏱ TIME */}
        <span className="
          absolute bottom-2 left-2
          text-xs bg-white/90 text-black
          px-2 py-1 rounded-full font-medium
        ">
          ⏱ {cookingTime} mins
        </span>

        {/* 🥗 DIET TAG */}
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${
            dietType === "veg"
              ? "bg-green-500 text-white"
              : dietType === "vegan"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {dietType}
        </span>

      </div>

      {/* TEXT */}
      <h3 className="font-semibold text-black dark:text-white mb-1 line-clamp-1">
        {title}
      </h3>

      {/* CALORIES */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        🔥 {calories} kcal
      </p>

    </div>
  );
}

export default RecipeCard;