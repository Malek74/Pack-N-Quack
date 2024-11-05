import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "./components/ui/toaster";
export default function App() {
  return (
    <div className="App">
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}
