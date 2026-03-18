import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import Home from "./pages/Home";

function App() {

  const { user } = useUser();

  useEffect(() => {

    if (user) {

      fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: user.fullName || "User",
          email: user.primaryEmailAddress.emailAddress,
          password: "clerk_user" // dummy password
        })
      });

    }

  }, [user]);

  return (
    <>
      <SignedIn>
        <Home />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default App;