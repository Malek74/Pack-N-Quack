import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./style/main.css";
import axios from 'axios';

axios.defaults.baseURL = "https://k0gfbwb4-8000.euw.devtunnels.ms/";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
