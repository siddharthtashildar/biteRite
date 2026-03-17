import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { ClerkProvider, ClerkLoaded } from "@clerk/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      signInUrl="/login"
      signUpUrl="/signup"
      afterSignOutUrl="/"
    >
      <ClerkLoaded>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkLoaded>
    </ClerkProvider>
  </StrictMode>
)