import { SignIn } from "@clerk/react";

function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <SignIn
        routing="path"
        path="/login"
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

export default Login;