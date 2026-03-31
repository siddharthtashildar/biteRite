import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

function Navbar({ username = "Foodie", onCreate }) {
  const { dark, setDark } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCreate = () => {
    if (typeof onCreate === "function") {
      onCreate();
    } else {
      navigate("/?create=true");
    }
  }
  const path = location.pathname.toLowerCase();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/recipes/search?q=${query}`
        );

        const data = await res.json();

        if (data.success) {
          setResults(data.recipes);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const handler = () => setShowDropdown(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <div className="flex justify-between items-center w-full mb-6 px-6 py-3">

      {/* LEFT SIDE */}
      <div className="flex flex-col">

        {/* SEARCH BAR */}
        <div className="relative">
          {!path.includes("profile") && !path.includes("community") && (
            <input
              type="text"
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="
                px-5 py-2.5 rounded-full w-80 border
                bg-white dark:bg-gray-800
                text-black dark:text-white
                border-gray-200 dark:border-gray-700
                shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6FAF4F]
              "
            />
          )}

          {/* DROPDOWN */}
          {showDropdown && results.length > 0 && (
            <div className="
              absolute mt-2 w-80 bg-white dark:bg-gray-800
              rounded-xl shadow-lg border z-50 overflow-hidden
            ">
              {results.map((recipe) => (
                <div
                  key={recipe._id}
                  onClick={() => {
                    navigate(`/recipe/${recipe._id}`, { state: recipe });
                    setShowDropdown(false);
                    setQuery("");
                  }}
                  className="
                    flex items-center gap-3 px-4 py-2
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    cursor-pointer transition
                  "
                >
                  <img
                    src={recipe.image}
                    className="w-10 h-10 rounded-lg object-cover"
                  />

                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">
                      {recipe.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {recipe.time || "Quick recipe"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        <button
          onClick={handleCreate}
          className="
            bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium
            border border-green-500 hover:bg-green-200 transition
          "
        >
          + Create Recipe
        </button>

        {/* THEME TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          className="
            px-3 py-2 rounded-full
            bg-white dark:bg-gray-700
            hover:scale-105 transition
          "
        >
          {dark ? (
            <FiMoon className="text-lg text-white" />
          ) : (
            <FiSun className="text-lg text-black" />
          )}
        </button>

      </div>
    </div>
  );
}

export default Navbar;