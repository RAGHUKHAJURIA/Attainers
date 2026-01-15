
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./context/AppContext";
import { ClerkProvider } from '@clerk/react-router'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'mock-key'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppProvider>
        <App />
      </AppProvider>
    </ClerkProvider>
  </BrowserRouter>,
)
