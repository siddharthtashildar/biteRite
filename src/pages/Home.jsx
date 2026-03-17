import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";


const recipes = [
  { title: "Special Salad Chicken", time: "20 mins" },
  { title: "Noodle Chicken", time: "20 mins" },
  { title: "Chicken with green veg", time: "20 mins" },
  { title: "Spicy Chicken Bowl", time: "20 mins" },
];

function Home() {
  return (
    <div className="flex min-h-screen bg-[#f6f4ef]">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar />

        <h1 className="text-3xl font-semibold mt-8 mb-4">
          Learn, Cook, & Eat your food
        </h1>

        <div className="flex gap-3 mb-8">
          {["Pizza", "Dessert", "Noodle", "Salad"].map((item) => (
            <button
              key={item}
              className="px-4 py-2 rounded-full border text-sm hover:bg-black hover:text-white transition"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-6">
          {recipes.map((recipe, i) => (
            <RecipeCard key={i} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
