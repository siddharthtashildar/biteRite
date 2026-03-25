import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";


function Home() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Recommended");

  const { user } = useUser();

  const [generated, setGenerated] = useState([]);
  const [saved, setSaved] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [displayRecipes, setDisplayRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [exploreRecipes, setExploreRecipes] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/recipes/${user.id}`
        );

        const data = await res.json();

        if (data.success) {
          setGenerated(data.generated || []);
          setSaved(data.saved || []);
          setFavorites(data.favorites || []);

          // Filter pending verification recipes
          const pending = (data.generated || []).filter(recipe => recipe.pendingVerification);
          setPendingRecipes(pending);

          // 🔥 default = recommended
          setDisplayRecipes(getRandom(data.generated, 6));
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipes();
  }, [user]);

  function getRandom(arr, n) {
    if (!arr) return [];

    return [...arr]
      .sort(() => 0.5 - Math.random())
      .slice(0, n);
  }

  useEffect(() => {
    if (!user) return;

    const fetchRecent = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/recipes/recent/${user.id}`
        );

        const data = await res.json();

        if (data.success) {
          setRecentRecipes(data.recipes);
        }

      } catch (err) {
        console.error("Failed to fetch recent recipes", err);
      }
    };

    fetchRecent();
  }, [user]);

  useEffect(() => {
    const fetchExploreRecipes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/recipes/verified`
        );

        const data = await res.json();

        if (data.success) {
          setExploreRecipes(data.recipes);
        }

      } catch (err) {
        console.error("Failed to fetch explore recipes", err);
      }
    };

    fetchExploreRecipes();
  }, []);

  return (
    <div className={`flex min-h-screen bg-[#f3efe9] dark:bg-gray-900 transition`}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className={`flex-1 p-10 main-content`}>

        <Navbar />

        {/* HERO */}
        <div className={`
          relative flex items-center justify-between 
          bg-white dark:bg-gray-800 
          rounded-3xl px-12 py-14 shadow-md overflow-hidden`}>

          {/* 🌟 GLOW */}
          <div className="absolute right-10 top-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30"></div>

          {/* 🌟 DOTS */}
          <div className="absolute right-20 top-16 grid grid-cols-6 gap-3 opacity-20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            ))}
          </div>

          {/* LEFT */}
          <div className="max-w-xl relative z-10">

            <p className="text-sm text-gray-400 mb-3 tracking-wide">
              More than 10,000 recipes
            </p>

            <h1 className="text-5xl font-semibold leading-tight mb-8 text-black dark:text-white">
              Generate Best Recipes <br />
              for your Meals
            </h1>

            <button
              onClick={() => navigate("/generate")}
              className="
                bg-green-500 text-white px-8 py-3 rounded-full text-sm font-medium 
                shadow-lg hover:scale-105 hover:bg-green-600 transition
              "
            >
              Generate →
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:flex justify-center items-center relative z-10">
            <img
              src="/src/assets/food.png"
              className="w-[380px] h-[380px] object-contain drop-shadow-2xl hover:scale-105 transition duration-300"
            />
          </div>
        </div>

        {/* SECTION BELOW HERO */}
        <div className="mt-10">

          <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
            Explore Categories
          </h2>

          {/* CATEGORY PILLS */}
          <div className="flex gap-3 flex-wrap">
            {["Recommended", "Saved", "Favorites", "Verified", "Pending Verification"].map((item) => (

              <button
                key={item}
                onClick={() => {
                  setActive(item);

                  if (item === "Recommended") {
                    setDisplayRecipes(getRandom(generated, 6));
                  }

                  if (item === "Saved") {
                    setDisplayRecipes(saved);
                  }

                  if (item === "Favorites") {
                    setDisplayRecipes(favorites);
                  }

                  if (item === "Verified") {
                    setDisplayRecipes(exploreRecipes);
                  }

                  if (item === "Pending Verification") {
                    setDisplayRecipes(pendingRecipes);
                  }
                }}
                className={`
                  px-6 h-10 rounded-full text-sm transition font-medium 
                  ${active === item
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white dark:bg-gray-800 border dark:border-gray-700 text-black dark:text-white"
                  }
                `}
              >
                {item}
              </button>
            ))}
            <div className="grid grid-cols-3 gap-8 mt-8  w-full">

              {displayRecipes.length > 0 ? (
                displayRecipes.map((recipe, i) => (
                  <RecipeCard
                    key={i}
                    recipe={recipe}
                    onClick={(r) =>
                      navigate(`/recipe/${r._id}`, { state: r })
                    }
                  />
                ))
              ) : (
                <p className="mt-30 text-gray-500">
                  No recipes found
                </p>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-6 mt-10 text-black dark:text-white">
            Recent
          </h2>

          {recentRecipes.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">
              No recent recipes yet 👀
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 animate-fadeIn">
              {recentRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={{
                    ...recipe,
                    time: recipe.time || "20 mins",
                    calories: recipe.nutrition?.calories || recipe.calories
                  }}
                  onClick={(r) =>
                    navigate(`/recipe/${r._id}`, { state: r })
                  }
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Home;