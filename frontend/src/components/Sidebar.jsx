import { useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiHeart,
  FiUsers,
  FiUser,
  FiMenu
} from "react-icons/fi";

function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div
      className={`h-screen bg-white p-4 flex flex-col justify-between rounded-r-3xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >

      {/* TOP */}
      <div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-6 p-2 rounded-lg hover:bg-gray-100"
        >
          <FiMenu size={20} />
        </button>

        {/* Logo */}
        {!collapsed && (
          <h2 className="text-2xl font-bold mb-8">BiteRite</h2>
        )}

        {/* User Section */}
        <div className="flex items-center gap-3 mb-10">

          <UserButton afterSignOutUrl="/" />

          {!collapsed && (
            <div>
              <p className="font-medium">
                {user?.fullName || "User"}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-3">

          <NavItem
            icon={<FiHome />}
            label="Dashboard"
            collapsed={collapsed}
            onClick={() => navigate("/")}
            active
          />

          <NavItem
            icon={<FiMenu />}
            label="Generate"
            collapsed={collapsed}
            onClick={() => navigate("/generate")}
            
          />

          <NavItem
            icon={<FiHeart />}
            label="Favorites"
            collapsed={collapsed}
          />

          <NavItem
            icon={<FiUsers />}
            label="Community"
            collapsed={collapsed}
            onClick={() => navigate("/CommunityFeed")}
            active={window.location.pathname === "/CommunityFeed"}
          />

          <NavItem
            icon={<FiUser />}
            label="Profile"
            collapsed={collapsed}
            onClick={() => navigate("/profile")}
          />

        </nav>

      </div>
    </div>
  );
}

/* 🔥 Reusable Nav Item */
function NavItem({ icon, label, collapsed, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
        active
          ? "bg-yellow-400"
          : "hover:bg-gray-100"
      }`}
    >
      <span className="text-lg">{icon}</span>

      {!collapsed && <span>{label}</span>}
    </button>
  );
}

export default Sidebar;