import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "flag-icons/css/flag-icons.min.css";
import { CustomToaster } from "./components/ui/CustomToaster";
import { AuthProvider } from "./context/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <CustomToaster />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
