import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style/main.css";
import axios from "axios";
axios.defaults.baseURL = "https://pack-n-quack-production-7f27.up.railway.app/";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
