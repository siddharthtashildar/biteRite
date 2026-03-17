import { SignUp } from "@clerk/react";

export default function Signup() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <SignUp
        routing="path"
        path="/signup"
        appearance={{
          elements: {
            card: "shadow-xl rounded-2xl",
            formButtonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-black",
          },
        }}
      />
    </div>
  );
}