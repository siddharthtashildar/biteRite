import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import IngredientInput from "../components/IngredientInput";
import CommunityFeed from "../components/CommunityFeed";

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
          Learn, Cook & Eat Healthy
        </h1>

        {/* Ingredient Input */}
        <IngredientInput />

        {/* Recipe Section */}
        <h2 className="text-xl font-semibold mb-4">Recommended Recipes</h2>

        <div className="grid grid-cols-4 gap-6 mb-10">
          {recipes.map((recipe, i) => (
            <RecipeCard key={i} recipe={recipe} />
          ))}
        </div>

        {/* Community Section */}
        <CommunityFeed />
      </div>
    </div>
  );
}

export default Home;