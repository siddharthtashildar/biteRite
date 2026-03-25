import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiHeart,
  FiUsers,
  FiUser,
  FiMenu,
  FiCheckCircle,
  FiBookmark,
  FiClock
} from "react-icons/fi";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState("user");

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        console.log("🔍 Fetching user role for:", user.id);
        const res = await fetch(
          `http://localhost:5000/api/users/${user.id}`
        );
        const data = await res.json();
        console.log("👥 User data:", data);
        setUserRole(data.role || "user");
        console.log("✅ User role set to:", data.role || "user");
      } catch (err) {
        console.error("❌ Error fetching user role:", err);
        setUserRole("user");
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    // Update body class for sidebar state
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [collapsed]);

  return (
    <div
      className={`
         fixed top-0 left-0 h-screen flex flex-col justify-between p-4
        transition-all duration-300 z-50
        ${collapsed ? "w-20" : "w-64"}
        
        bg-white dark:bg-gray-900
        text-black dark:text-white
        
        border-r border-gray-200 dark:border-gray-800
      `}
    >

      {/* TOP */}
      <div>

        {/* TOGGLE */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-6 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FiMenu size={20} />
        </button>

        {/* LOGO */}
        {!collapsed && (
          <h2 className="text-2xl font-bold mb-8 tracking-tight">
            BiteRite
          </h2>
        )}

        {/* USER */}
        <div className="flex items-center gap-3 mb-10">
          <UserButton afterSignOutUrl="/" />

          {!collapsed && (
            <div>
              <p className="font-medium text-sm">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-400">
                Food Explorer
              </p>
            </div>
          )}
        </div>

        {/* NAV */}
        <nav className="space-y-2">

          <NavItem
            icon={<FiHome />}
            label="Dashboard"
            collapsed={collapsed}
            onClick={() => navigate("/")}
            active={location.pathname === "/"}
          />

          <NavItem
            icon={<FiMenu />}
            label="Generate"
            collapsed={collapsed}
            onClick={() => navigate("/generate")}
            active={location.pathname === "/generate"}
          />

          <NavItem
            icon={<FiHeart />}
            label="Favorites"
            collapsed={collapsed}
            onClick={() => navigate("/favorites")}
            active={location.pathname === "/favorites"}
          />

          <NavItem
            icon={<FiCheckCircle />}
            label="Verified Recipes"
            collapsed={collapsed}
            onClick={() => navigate("/verified-recipes")}
            active={location.pathname === "/verified-recipes"}
          />

          <NavItem
            icon={<FiBookmark />}
            label="Saved Recipes"
            collapsed={collapsed}
            onClick={() => navigate("/saved-recipes")}
            active={location.pathname === "/saved-recipes"}
          />

          <NavItem
            icon={<FiClock />}
            label="Pending Verification"
            collapsed={collapsed}
            onClick={() => navigate("/pending-verification")}
            active={location.pathname === "/pending-verification"}
          />

          <NavItem
            icon={<FiUsers />}
            label="Community"
            collapsed={collapsed}
            onClick={() => navigate("/CommunityFeed")}
            active={location.pathname === "/CommunityFeed"}
          />

          <NavItem
            icon={<FiUser />}
            label="Profile"
            collapsed={collapsed}
            onClick={() => navigate("/profile")}
            active={location.pathname === "/profile"}
          />

          {userRole === "dietician" && (
            <NavItem
              icon={<FiUsers />}
              label="Verify Recipes"
              collapsed={collapsed}
              onClick={() => navigate("/dietician-dashboard")}
              active={location.pathname === "/dietician-dashboard"}
            />
          )}

        </nav>
      </div>
    </div>
  );
}


/* 🔥 PREMIUM NAV ITEM */
function NavItem({ icon, label, collapsed, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all
        
        ${active
          ? "bg-yellow-400 text-black shadow-sm"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
    >
      <span className="text-lg">{icon}</span>

      {!collapsed && (
        <span className="text-sm font-medium">
          {label}
        </span>
      )}
    </button>
  );
}

export default Sidebar;