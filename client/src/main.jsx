import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style/main.css";
import axios from "axios";

axios.defaults.baseURL = "https://5bbbq9p8-8000.euw.devtunnels.ms/";
//axios.defaults.baseURL = "http://localhost:8000/";

//axios.defaults.baseURL = "https://k0gfbwb4-8000.euw.devtunnels.ms/";

//axios.defaults.baseURL = "https://t18zlb13-8000.uks1.devtunnels.ms/";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
