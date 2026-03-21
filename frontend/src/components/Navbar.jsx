import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

function Navbar() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <div className="flex justify-between items-center mb-6">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search recipes..."
        className="
          px-5 py-2.5 rounded-full w-80 border
          bg-white dark:bg-gray-800
          text-black dark:text-white
          border-gray-200 dark:border-gray-700
          shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400
        "
      />

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* THEME TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          className="
            px-3 py-2 rounded-full
            bg-gray-100 dark:bg-gray-700
            hover:scale-105 transition
          "
        >
          {dark ? (
            <FiMoon className="text-lg text-white" />
          ) : (
            <FiSun className="text-lg text-black" />
          )}
        </button>

        {/* PREMIUM BUTTON */}
        <button className="
          px-4 py-2 bg-yellow-400 rounded-full font-medium
          shadow-sm hover:scale-105 transition
        ">
          Premium
        </button>

      </div>
    </div>
  );
}

export default Navbar;