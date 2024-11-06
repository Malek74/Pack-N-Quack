import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style/main.css";
import axios from "axios";
axios.defaults.baseURL = "https://dqbw8hmb-8000.uks1.devtunnels.ms/";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
