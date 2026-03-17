import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

function Navbar() {
  return (
    <div className="flex justify-between items-center">
      <div className="relative">
        <input
          type="text"
          placeholder="Search recipes..."
          className="px-4 py-2 rounded-full w-80 border focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton mode="redirect" redirectUrl="/login">
            <button className="px-5 py-2 border rounded-full font-medium">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton>
            <button className="px-5 py-2 border rounded-full font-medium">
              Sign Up
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>

        <button className="px-5 py-2 bg-yellow-400 rounded-full font-medium">
          Premium →
        </button>
      </div>
    </div>
  );
}

export default Navbar;