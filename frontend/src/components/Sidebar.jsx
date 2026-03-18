import { UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  const { user } = useUser();

  return (
    <div className="w-64 bg-white p-6 flex flex-col justify-between rounded-r-3xl">

      <div>

        <h2 className="text-2xl font-bold mb-8">BiteRite</h2>

        {/* User Section */}
        <div className="flex items-center gap-3 mb-10">

          {/* Clerk Avatar + Logout */}
          <UserButton afterSignOutUrl="/" />

          <div>
            <p className="font-medium">
              {user?.fullName || "User"}
            </p>
            <p className="text-sm text-gray-500">
              {user?.primaryEmailAddress?.emailAddress || "Food Explorer"}
            </p>
          </div>

        </div>

        {/* Navigation */}
        <nav className="space-y-3">

          <button onClick={() => navigate("/")} className="w-full text-left px-4 py-2 rounded-lg bg-yellow-400">
            Dashboard
          </button>

          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Generate Recipe
          </button>

          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Favorites
          </button>

          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Community
          </button>

          <button onClick={() => navigate("/profile")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Profile
          </button>

        </nav>

      </div>

    </div>
  );
}

export default Sidebar;