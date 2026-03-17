import { useState } from 'react'
import './App.css'
import Home from "./pages/Home";
import UserInfo from "./pages/user-profile";
import { Routes, Route } from "react-router-dom";
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";


function App() {
  const [count, setCount] = useState(0)

<<<<<<< HEAD:src/App.jsx
 return (
<>
   <header>
  <Show when="signed-out">
    <SignInButton mode="redirect" redirectUrl="/login" />
    <SignUpButton />
  </Show>

  <Show when="signed-in">
    <UserButton />
  </Show>
</header>

  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/user" element={<UserInfo />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Routes>
  
  </>
)
=======
  return (
    <>
    
    <Home />;
    </>
  )
>>>>>>> main:frontend/src/App.jsx
}

export default App
