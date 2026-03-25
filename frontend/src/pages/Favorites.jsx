import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { FiHeart, FiArrowRight } from "react-icons/fi";

function Favorites() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/recipes/${user.id}`
        );

        const data = await res.json();

        if (data.success) {
          setFavorites(data.favorites || []);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className={`flex min-h-screen bg-[#f3efe9] dark:bg-gray-900 transition`}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className={`flex-1 p-10 main-content`}>

        <Navbar />

        {/* HEADER */}
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your saved favorite recipes
          </p>
        </div>

        {/* FAVORITES GRID */}
        <div className="grid grid-cols-3 gap-8">
          {favorites.length > 0 ? (
            favorites.map((recipe, i) => (
              <RecipeCard
                key={i}
                recipe={recipe}
                onClick={(r) =>
                  navigate(`/recipe/${r._id}`, { state: r })
                }
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-20">
              <div className="text-6xl mb-4 text-red-400">
                <FiHeart />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Start exploring recipes and add them to your favorites!
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-green-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
              >
                Explore Recipes <FiArrowRight />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Favorites;