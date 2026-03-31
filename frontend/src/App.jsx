import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser
} from "@clerk/clerk-react";

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import UserInfo from "./pages/userProfile";
import Onboarding from "./pages/Onboarding";
import Generate from "./pages/Generate";
import Results from "./pages/Results";
import Recipe from "./pages/Recipe";
import CommunityFeed from "./pages/CommunityFeed";
import DieticianDashboard from "./pages/DieticianDashboard";
import Favorites from "./pages/Favorites";
import SavedRecipes from "./pages/SavedRecipes";
import YourRecipes from "./pages/YourRecipes";

function App() {
  const { user, isLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
      document.documentElement.classList.add("dark");

  if (!isLoaded) return;

  if (!user) {
    setLoading(false);
    return;
  }

  const syncUser = async () => {
    try {
      console.log("Syncing user:", user.id);

      const res = await fetch("http://localhost:5000/api/users/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        }),
      });

      const data = await res.json();

      console.log("User sync:", data);

      setOnboardingDone(data.onboardingCompleted || false);
      setUserRole(data.role || "user");

    } catch (err) {
      console.error("Sync error:", err);
      setOnboardingDone(false);
    } finally {
      setLoading(false);
    }
  };

  syncUser();
}, [user, isLoaded]);

  // ⏳ wait till clerk + backend check complete
  if (!isLoaded) return <p>Loading Clerk...</p>;
  if (loading) return <p>Checking user...</p>;

  return (
    <>
      <SignedIn>
        <Routes>

          {!onboardingDone ? (
            <Route path="*" element={<Onboarding />} />
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<UserInfo />} />
              <Route path="/recipe/:id" element={<Recipe />} />
              <Route path="/CommunityFeed" element={<CommunityFeed />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {/* ✅ MAIN APP */}
          {onboardingDone && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<UserInfo />} />
              <Route path="/recipe/:id" element={<Recipe />} />
              <Route path="/CommunityFeed" element={<CommunityFeed />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/verified-recipes" element={<YourRecipes initialTab="Verified Recipes" />} />
              <Route path="/saved-recipes" element={<SavedRecipes />} />
              <Route path="/pending-verification" element={<YourRecipes initialTab="Pending Verification" />} />
              <Route path="/your-recipes" element={<YourRecipes />} />
              
              {/* Dietician Dashboard - only accessible by dieticians */}
              {userRole === "dietician" && (
                <Route path="/dietician-dashboard" element={<DieticianDashboard />} />
              )}

              {/* fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

        </Routes>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default App;