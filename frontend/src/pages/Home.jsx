import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function Home() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Pizza");

  return (
    <div className="flex min-h-screen bg-[#f3efe9] dark:bg-gray-900 transition">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-10">

        <Navbar />

        {/* HERO */}
        <div className="
          relative flex items-center justify-between 
          bg-white dark:bg-gray-800 
          rounded-3xl px-12 py-14 shadow-md overflow-hidden
        ">

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
            {["Pizza", "Dessert", "Noodle", "Cocktails", "Salad"].map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`
                  px-4 py-2 rounded-full text-sm transition
                  ${active === item
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white dark:bg-gray-800 border dark:border-gray-700 text-black dark:text-white"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;